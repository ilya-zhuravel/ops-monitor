import { Injectable } from '@nestjs/common';
import {StatusEndpointResponse} from "../types";
import {InjectModel} from "@nestjs/mongoose";
import {ServerStatusEntry} from "../db/server-status-entry.schema";
import {Model} from "mongoose";

const URLS = {
  'us-east': 'https://data--us-east.upscope.io/status?stats=1',
  'us-west': 'https://data--us-west.upscope.io/status?stats=1',
  'eu-west': 'https://data--eu-west.upscope.io/status?stats=1',
  'eu-central': 'https://data--eu-central.upscope.io/status?stats=1',
  'sa-east': 'https://data--sa-east.upscope.io/status?stats=1',
  'ap-southeast': 'https://data--ap-southeast.upscope.io/status?stats=1',
}

@Injectable()
export class ApiService {
  constructor(@InjectModel(ServerStatusEntry.name) private serverStatusEntryModel: Model<ServerStatusEntry>) {
  }

  isValidRegion(region: string): boolean {
    return Boolean(URLS[region]);
  }

  async fetchStatuses(): Promise<StatusEndpointResponse[]> {
    const promises = Object.keys(URLS).map(async (region) => {
      return this.fetchStatus(region);
    });

    return Promise.all(promises);
  }

  async fetchStatus(region: string): Promise<StatusEndpointResponse> {
    if (!this.isValidRegion(region)) {
      throw new Error(`Region ${region} is not supported.`);
    }

    const url = URLS[region];

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Error fetching status for region ${region}`);
    }

    return response.json();
  }

  async getRecentStatusHistory(region: string): Promise<ServerStatusEntry[]> {
    if (!this.isValidRegion(region)) {
      throw new Error(`Region ${region} is not supported.`);
    }
    const timeAgo24h = new Date(Date.now() - 24*60*60 * 1000);
    return this.serverStatusEntryModel.find({ region, ts: { $gt: timeAgo24h} }, {}, { sort: { ts: -1 } }).exec();
  }

  getMostRecentStatus(region: string): Promise<ServerStatusEntry | null> {
    return this.serverStatusEntryModel.findOne({ region }, {}, { sort: { ts: -1 }, limit: 1 }).exec();
  }

}
