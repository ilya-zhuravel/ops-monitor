import { Module } from '@nestjs/common';
import {DbModule} from "../db/db.module";
import {ApiService} from "./api.service";
import {MonitorGateway} from "./monitor.gateway";

@Module({
  imports: [
    DbModule
  ],
  exports: [],
  providers: [ApiService, MonitorGateway],
})
export class ApiModule {}
