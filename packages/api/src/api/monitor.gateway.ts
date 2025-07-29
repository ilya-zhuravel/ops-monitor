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
import {CurrentStatusResponse, ServerStatusHistory} from "../types";
import {dto2Response, ServerStatusEntry} from "../db/server-status-entry.schema";
import {ConnectedSocket} from "@nestjs/websockets/decorators/connected-socket.decorator";
import {ApiService} from "./api.service";

const UPDATE_INTERVAL = 1000 //* 60 * 5; // 5 minutes

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MonitorGateway {
  private clients = new WeakMap();

  constructor(private apiService: ApiService) {
  }

  @WebSocketServer()
  server: Server;

  getCurrentStatus$(region: string) {
    if(!this.apiService.isValidRegion(region)) {
      throw new Error('Invalid region ' + region)
    }

    return interval(UPDATE_INTERVAL).pipe(
      startWith(0),
      mergeMap(() => {
        return fromPromise(this.apiService.getMostRecentStatus(region)).pipe(
          filter(Boolean),
          map((response: ServerStatusEntry): WsResponse<CurrentStatusResponse> => ({
            event: 'currentStatus',
            data: dto2Response(response)
          })),
        );
      })
    );

  }

  @SubscribeMessage('getStatusHistory')
  async statusHistory(@MessageBody('region') region: string): Promise<WsResponse<ServerStatusHistory>> {
    const recentHistory = await this.apiService.getRecentStatusHistory(region);

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
      destroy$.next(true);
      destroy$.complete();
      this.clients.delete(client);
    }

    const destroy$ = new Subject();
    const stream$ = this.getCurrentStatus$(region).pipe(takeUntil(destroy$));

    this.clients.set(client, {
      destroy$,
      stream$
    });

    return stream$;
  }
}
