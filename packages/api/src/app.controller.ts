import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('/health-status')
  healthStatus(): string {
    return "ok";
  }
}
