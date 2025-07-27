export interface StatusEndpointResponse {
  status: string;
  region: string;
  results: {
    services: Record<string, boolean>;
    stats: {
      server_count: number;
      online: number;
      session: number;
      server: {
        cpus: number;
        active_connections: number;
        wait_time: number;
        cpu_load: number;
        timers: number;
        workers: Array<[
          string,
          {
            wait_time: number;
            workers: number;
            waiting: number;
            idle: number;
            time_to_return: number;
          }
        ]>;
      }
    }
  },
  strict: boolean;
  server_issue: string | null;
}


export interface CurrentStatusResponse {
  lastUpdate: number;
  serverCount: number;
  online: number;
  session: number;
  cpus: number;
  activeConnections: number;
  waitTime: number;
  cpuLoad: number;
  timers: number;
}
