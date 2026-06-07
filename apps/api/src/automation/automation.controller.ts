import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { AutomationService } from './automation.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('automation')
@UseGuards(JwtAuthGuard)
export class AutomationController {
  constructor(private readonly service: AutomationService) {}

  @Get('rules')
  findAll(@Req() req: any) {
    return this.service.findAll(req.user.tenantId);
  }

  @Post('rules')
  create(@Req() req: any, @Body() body: any) {
    return this.service.create(req.user.tenantId, body);
  }

  @Patch('rules/:id/toggle')
  toggle(@Req() req: any, @Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.service.toggle(req.user.tenantId, id, isActive);
  }

  @Delete('rules/:id')
  delete(@Req() req: any, @Param('id') id: string) {
    return this.service.delete(req.user.tenantId, id);
  }

  @Get('logs')
  getLogs(@Req() req: any) {
    return this.service.getLogs(req.user.tenantId);
  }

  @Get('channels')
  getChannels(@Req() req: any) {
    return this.service.getChannels(req.user.tenantId);
  }

  @Post('channels')
  saveChannels(@Req() req: any, @Body() body: any) {
    return this.service.saveChannels(req.user.tenantId, body);
  }
}
