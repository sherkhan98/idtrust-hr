import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LeaveService } from './leave.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, TenantId } from '../common/decorators/current-user.decorator';
import { IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class ApplyLeaveDto {
  @ApiProperty() @IsString() leaveTypeId: string;
  @ApiProperty() @IsDateString() startDate: string;
  @ApiProperty() @IsDateString() endDate: string;
  @IsOptional() @IsString() reason?: string;
}

@ApiTags('Leave')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leave')
export class LeaveController {
  constructor(private leaveService: LeaveService) {}

  @Get('types')
  getTypes(@TenantId() tenantId: string) {
    return this.leaveService.getLeaveTypes(tenantId);
  }

  @Get()
  list(
    @TenantId() tenantId: string,
    @Query('employeeId') employeeId?: string,
    @Query('status') status?: string,
  ) {
    return this.leaveService.listLeaves(tenantId, { employeeId, status });
  }

  @Get('balance')
  getBalance(@TenantId() tenantId: string, @CurrentUser() user: any) {
    return this.leaveService.getLeaveBalance(user.employee?.id, tenantId);
  }

  @Post('apply')
  apply(@TenantId() tenantId: string, @CurrentUser() user: any, @Body() dto: ApplyLeaveDto) {
    return this.leaveService.applyLeave(tenantId, user.employee?.id, dto);
  }

  @Put(':id/approve')
  @ApiOperation({ summary: 'Approve leave request' })
  approve(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.leaveService.approveLeave(id, userId);
  }

  @Put(':id/reject')
  reject(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body('reason') reason?: string,
  ) {
    return this.leaveService.rejectLeave(id, userId, reason);
  }
}
