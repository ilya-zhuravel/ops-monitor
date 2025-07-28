import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {CurrentStatusResponse, StatusEndpointResponse} from "../types";

@Schema()
export class ServerStatusEntry {
  _id: mongoose.Types.ObjectId;

  @Prop()
  region: string;

  @Prop({ type: mongoose.SchemaTypes.Mixed })
  data: StatusEndpointResponse["results"];

  @Prop({ type: mongoose.SchemaTypes.Date })
  ts: Date;
}

export const ServerStatusEntrySchema = SchemaFactory.createForClass(ServerStatusEntry);

export const dto2Response = (dto: ServerStatusEntry): CurrentStatusResponse => ({
  serverCount: dto.data.stats.server_count,
  online: dto.data.stats.online,
  session: dto.data.stats.session,
  cpus: dto.data.stats.server.cpus,
  activeConnections: dto.data.stats.server.active_connections,
  waitTime: dto.data.stats.server.wait_time,
  cpuLoad: dto.data.stats.server.cpu_load,
  timers: dto.data.stats.server.timers,
  ts: dto?.ts.getTime()
});
