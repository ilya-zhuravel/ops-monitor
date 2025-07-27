import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import {filter, interval, map, mergeMap, Observable, startWith, tap} from 'rxjs';
import { Server } from 'socket.io';
import {AppService} from "../app.service";
import {CurrentStatusResponse} from "./types";
import {fromPromise} from "rxjs/internal/observable/innerFrom";

const UPDATE_INTERVAL = 1000 //* 60 * 5; // 5 minutes

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MonitorGateway {
  private currentStates$: Record<string, Observable<WsResponse<CurrentStatusResponse>>> = {};

  constructor(private appService: AppService) {
  }

  @WebSocketServer()
  server: Server;

  getCurrentStatus$(region) {
    if(!this.appService.isValidRegion(region)) {
      throw new Error('Invalid region ' + region)
    }
    if (!this.currentStates$[region]) {
      this.currentStates$[region] = interval(UPDATE_INTERVAL).pipe(
        startWith(0),
        mergeMap(() => {
          return fromPromise(
            this.appService.getMostRecentStatus(region)).pipe(
              tap((status) => { console.log(status) }),
              filter(Boolean),
              map((response): WsResponse<CurrentStatusResponse> => ({
                event: 'currentStatus',
                data: {
                  serverCount: response.data.stats.server_count,
                  online: response.data.stats.online,
                  session: response.data.stats.session,
                  cpus: response.data.stats.server.cpus,
                  activeConnections: response.data.stats.server.active_connections,
                  waitTime: response.data.stats.server.wait_time,
                  cpuLoad: response.data.stats.server.cpu_load,
                  timers: response.data.stats.server.timers,
                  lastUpdate: response?.ts.getTime()
                }
              })),
          );
        })
      );
    }

    return this.currentStates$[region];
  }

  @SubscribeMessage('setRegion')
  currentStatus(@MessageBody('region') region: string): Observable<WsResponse<CurrentStatusResponse>> {
    return this.getCurrentStatus$(region);
  }
}
