import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  MongooseModuleAsyncOptions,
  MongooseModuleFactoryOptions,
} from '@nestjs/mongoose/dist/interfaces/mongoose-options.interface';
import { ScheduleModule } from '@nestjs/schedule';
import {ServerStatusEntry, ServerStatusEntrySchema} from "./db/server-status-entry.schema";
import {AppService} from "./app.service";
import {TasksService} from "./tasks.service";
import {MonitorGateway} from "./monitor.gateway";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService): MongooseModuleFactoryOptions => {
        return { uri: configService.get('MONGODB_URI') };
      },
      inject: [ConfigService],
    } as MongooseModuleAsyncOptions),
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{ name: ServerStatusEntry.name, schema: ServerStatusEntrySchema }])
  ],
  controllers: [],
  providers: [AppService, TasksService, MonitorGateway],
})
export class AppModule {}
