import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  MongooseModuleAsyncOptions,
  MongooseModuleFactoryOptions,
} from '@nestjs/mongoose/dist/interfaces/mongoose-options.interface';
import { ScheduleModule } from '@nestjs/schedule';
import {AppService} from "./services/app.service";
import {TasksService} from "./services/tasks.service";
import {MonitorGateway} from "./monitor.gateway";
import {DbModule} from "./db/db.module";

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
    DbModule
  ],
  controllers: [],
  providers: [AppService, TasksService, MonitorGateway],
})
export class AppModule {}
