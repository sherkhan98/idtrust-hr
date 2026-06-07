import {
  Controller, Get, Post, Put, Delete, Patch, Body, Param,
  Query, UseGuards, HttpCode, HttpStatus, Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeFilterDto } from './dto/employee-filter.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { TenantId } from '../common/decorators/current-user.decorator';

@ApiTags('Employees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @Get()
  @ApiOperation({ summary: 'List employees with filtering and pagination' })
  findAll(@TenantId() tenantId: string, @Query() filter: EmployeeFilterDto) {
    return this.employeesService.findAll(tenantId, filter);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get employee statistics' })
  getStats(@TenantId() tenantId: string) {
    return this.employeesService.getStats(tenantId);
  }

  @Get('org-chart')
  @ApiOperation({ summary: 'Get org chart data' })
  getOrgChart(@TenantId() tenantId: string) {
    return this.employeesService.getOrgChart(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee details' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.employeesService.findOne(tenantId, id);
  }

  @Post()
  @Roles('TENANT_ADMIN', 'HR_MANAGER')
  @ApiOperation({ summary: 'Create new employee with optional app account' })
  create(@TenantId() tenantId: string, @Body() dto: any) {
    return this.employeesService.createWithAccount(tenantId, dto);
  }

  @Patch(':id/permissions')
  @Roles('TENANT_ADMIN', 'HR_MANAGER')
  @ApiOperation({ summary: 'Update employee app permissions' })
  updatePermissions(@TenantId() tenantId: string, @Param('id') id: string, @Body() body: any) {
    return this.employeesService.updatePermissions(tenantId, id, body.permissions);
  }

  @Post(':id/reset-password')
  @Roles('TENANT_ADMIN', 'HR_MANAGER')
  @ApiOperation({ summary: 'Reset employee account password' })
  resetPassword(@TenantId() tenantId: string, @Param('id') id: string, @Body() body: any) {
    return this.employeesService.resetPassword(tenantId, id, body.newPassword);
  }

  @Get('me/profile')
  @ApiOperation({ summary: 'Get my own employee profile' })
  getMyProfile(@TenantId() tenantId: string, @Query('userId') userId: string) {
    return this.employeesService.getMyProfile(tenantId, userId);
  }

  @Put(':id')
  @Roles('TENANT_ADMIN', 'HR_MANAGER')
  @ApiOperation({ summary: 'Update employee' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @Roles('TENANT_ADMIN', 'HR_MANAGER')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Terminate employee' })
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.employeesService.remove(tenantId, id);
  }
}
