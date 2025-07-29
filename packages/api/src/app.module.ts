import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  MongooseModuleAsyncOptions,
  MongooseModuleFactoryOptions,
} from '@nestjs/mongoose/dist/interfaces/mongoose-options.interface';
import {CronModule} from "./cron/cron.module";
import {ApiModule} from "./api/api.module";

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
    CronModule,
    ApiModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
