import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {StatusEndpointResponse} from "../types";

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
