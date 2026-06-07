import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class HealthController {
  @Get('api/v1/health')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString(), service: 'IDTrust API' };
  }
}
