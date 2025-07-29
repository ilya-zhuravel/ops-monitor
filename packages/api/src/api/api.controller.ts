import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class ApiController {
  @Get('health')
  health(): string {
    return 'ok';
  }
}
