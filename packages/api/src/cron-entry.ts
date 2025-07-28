import { NestFactory } from '@nestjs/core';
import { CronEntryModule } from "./cron/cron-entry.module";

async function bootstrap() {
  const app = await NestFactory.create(CronEntryModule);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
