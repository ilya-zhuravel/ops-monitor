import { Module } from '@nestjs/common';
import {DbModule} from "../db/db.module";
import {ApiService} from "./api.service";
import {MonitorGateway} from "./monitor.gateway";
import {ApiController} from "./api.controller";

@Module({
  imports: [
    DbModule
  ],
  controllers: [ApiController],
  exports: [],
  providers: [ApiService, MonitorGateway],
})
export class ApiModule {}
