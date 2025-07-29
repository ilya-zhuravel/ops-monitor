import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  MongooseModuleAsyncOptions,
  MongooseModuleFactoryOptions,
} from '@nestjs/mongoose/dist/interfaces/mongoose-options.interface';
import {ApiModule} from "./api.module";

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
    ApiModule
  ],
  controllers: [],
  providers: [],
})
export class ApiEntryModule {}
