import { NestFactory } from '@nestjs/core';
import {ApiEntryModule} from "./api/api-entry.module";

async function bootstrap() {
  const app = await NestFactory.create(ApiEntryModule);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
