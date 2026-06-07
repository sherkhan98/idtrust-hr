import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { KpiService } from './kpi.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantId, CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('KPI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('kpi')
export class KpiController {
  constructor(private kpiService: KpiService) {}

  @Get() findAll(@TenantId() tenantId: string) { return this.kpiService.findAll(tenantId); }
  @Post() create(@TenantId() tenantId: string, @Body() dto: any) { return this.kpiService.create(tenantId, dto); }
  @Post('score') recordScore(@Body() dto: any) { return this.kpiService.recordScore(dto); }
  @Get('employee/:id') getEmployeeKPI(@Param('id') id: string, @Query('period') period?: string) { return this.kpiService.getEmployeeKPI(id, period); }
  @Get('department/:id') getDeptKPI(@Param('id') id: string, @Query('period') period: string) { return this.kpiService.getDepartmentKPI(id, period); }
}
