import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {ServerStatusEntry} from "../db/server-status-entry.schema";
import {CronService} from "./cron.service";

@Injectable()
export class TasksService {
  constructor(
    private cronService: CronService,
    @InjectModel(ServerStatusEntry.name) private serverStatusEntryModel: Model<ServerStatusEntry>,
  ) {
  }

  @Cron('5 * * * * *')
  async pullDataTask() {

    try {
      const statusResults = await this.cronService.fetchStatuses();

      await Promise.all(statusResults.map(async (statusResponse) => {
        const newEntry = new this.serverStatusEntryModel({
          region: statusResponse.region,
          data: statusResponse.results,
          ts: new Date(),
        });

        return newEntry.save();
      }));
    } catch (error) {
      console.error('Error in data pull cron job', error);
    }
  }
}
