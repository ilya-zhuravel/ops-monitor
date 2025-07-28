import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import {filter, interval, map, mergeMap, Observable, startWith, Subject, takeUntil} from 'rxjs';
import { Server } from 'socket.io';
import {AppService} from "./services/app.service";
import {CurrentStatusResponse, ServerStatusHistory} from "./types";
import {dto2Response, ServerStatusEntry} from "./db/server-status-entry.schema";
import {ConnectedSocket} from "@nestjs/websockets/decorators/connected-socket.decorator";

const UPDATE_INTERVAL = 1000; //* 60 * 5; // 5 minutes

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MonitorGateway {
  private currentStates$: Record<string, Observable<WsResponse<CurrentStatusResponse>>> = {};
  private clients = new WeakMap();

  constructor(private appService: AppService) {
  }

  @WebSocketServer()
  server: Server;

  getCurrentStatus$(region: string) {
    if(!this.appService.isValidRegion(region)) {
      throw new Error('Invalid region ' + region)
    }

    if (!this.currentStates$[region]) {
      this.currentStates$[region] = interval(UPDATE_INTERVAL).pipe(
        startWith(0),
        mergeMap(() => {
          return fromPromise(this.appService.getMostRecentStatus(region)).pipe(
            filter(Boolean),
            map((response: ServerStatusEntry): WsResponse<CurrentStatusResponse> => ({
              event: 'currentStatus',
              data: dto2Response(response)
            })),
          );
        })
      );
    }

    return this.currentStates$[region];
  }

  @SubscribeMessage('getStatusHistory')
  async statusHistory(@MessageBody('region') region: string): Promise<WsResponse<ServerStatusHistory>> {
    const recentHistory = await this.appService.getRecentStatusHistory(region);

    return {
      event: 'statusHistory',
      data: {
        region,
        data: recentHistory.map(dto2Response)
      }
    };
  }

  @SubscribeMessage('setRegion')
  currentStatus(@MessageBody('region') region: string, @ConnectedSocket() client: object ): Observable<WsResponse<CurrentStatusResponse>> {
    if(this.clients.has(client)) {
      const {destroy$} = this.clients.get(client);
      this.clients.delete(client);
      destroy$.next();
      destroy$.complete();
      this.clients.delete(client);

      console.log('Unsubscribe');
    }

    const destroy$ = this.clients.get(client)?.destroy$ || new Subject();
    const stream$ = this.getCurrentStatus$(region).pipe(takeUntil(destroy$));

    this.clients.set(client, {
      destroy$: new Subject(),
      stream$
    });

    return stream$;
  }
}
