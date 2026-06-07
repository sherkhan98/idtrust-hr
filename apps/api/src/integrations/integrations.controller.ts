import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { CreateIntegrationDto, UpdateIntegrationDto, SyncIntegrationDto } from './dto/integration.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('integrations')
@UseGuards(JwtAuthGuard)
export class IntegrationsController {
  constructor(private readonly service: IntegrationsService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.service.findAll(req.user.tenantId);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.service.findOne(req.user.tenantId, id);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateIntegrationDto) {
    return this.service.create(req.user.tenantId, dto);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateIntegrationDto) {
    return this.service.update(req.user.tenantId, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.user.tenantId, id);
  }

  @Post(':id/test')
  testConnection(@Req() req: any, @Param('id') id: string) {
    return this.service.testConnection(req.user.tenantId, id);
  }

  @Post(':id/sync')
  sync(@Req() req: any, @Param('id') id: string, @Body() dto: SyncIntegrationDto) {
    return this.service.sync(req.user.tenantId, id, dto.syncType);
  }

  @Get(':id/logs')
  getLogs(@Req() req: any, @Param('id') id: string) {
    return this.service.getLogs(req.user.tenantId, id);
  }
}
