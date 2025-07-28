import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {ServerStatusEntry, ServerStatusEntrySchema} from "./server-status-entry.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: ServerStatusEntry.name, schema: ServerStatusEntrySchema }])],
  exports: [MongooseModule]
})
export class DbModule {}
