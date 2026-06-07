import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, TenantId } from '../common/decorators/current-user.decorator';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('ceo')
  @ApiOperation({ summary: 'CEO Dashboard - company-wide overview' })
  getCEO(@TenantId() tenantId: string) {
    return this.dashboardService.getCEODashboard(tenantId);
  }

  @Get('hr')
  @ApiOperation({ summary: 'HR Dashboard' })
  getHR(@TenantId() tenantId: string) {
    return this.dashboardService.getHRDashboard(tenantId);
  }

  @Get('employee')
  @ApiOperation({ summary: 'Employee self-service dashboard' })
  getEmployee(
    @TenantId() tenantId: string,
    @CurrentUser('employeeId') employeeId: string,
  ) {
    return this.dashboardService.getEmployeeDashboard(tenantId, employeeId);
  }
}
