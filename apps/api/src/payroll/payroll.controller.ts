import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PayrollService } from './payroll.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { TenantId, CurrentUser } from '../common/decorators/current-user.decorator';
import { IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreatePeriodDto {
  @ApiProperty({ example: 'May 2024' })
  @IsString()
  name: string;

  @ApiProperty({ example: '2024-05-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-05-31' })
  @IsDateString()
  endDate: string;
}

@ApiTags('Payroll')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payroll')
export class PayrollController {
  constructor(private payrollService: PayrollService) {}

  @Get('periods')
  listPeriods(@TenantId() tenantId: string) {
    return this.payrollService.listPeriods(tenantId);
  }

  @Post('periods')
  @Roles('TENANT_ADMIN', 'HR_MANAGER')
  createPeriod(@TenantId() tenantId: string, @Body() dto: CreatePeriodDto) {
    return this.payrollService.createPeriod(tenantId, dto);
  }

  @Post('periods/:id/calculate')
  @Roles('TENANT_ADMIN', 'HR_MANAGER')
  @ApiOperation({ summary: 'Calculate payroll for a period' })
  calculate(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.payrollService.calculatePayroll(tenantId, id);
  }

  @Get('periods/:id/payrolls')
  getPeriodPayrolls(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.payrollService.getPeriodPayrolls(tenantId, id);
  }

  @Get('my-history')
  getMyHistory(@CurrentUser() user: any) {
    return this.payrollService.getEmployeePayrollHistory(user.employee?.id);
  }

  @Get('employee/:id')
  getEmployeeHistory(@Param('id') employeeId: string) {
    return this.payrollService.getEmployeePayrollHistory(employeeId);
  }
}
