import { Module } from '@nestjs/common';
import {CronService} from "./cron.service";
import {ScheduleModule} from "@nestjs/schedule";
import {TasksService} from "./tasks.service";
import {DbModule} from "../db/db.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DbModule
  ],
  exports: [],
  providers: [CronService, TasksService],
})
export class CronModule {}
