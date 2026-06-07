import {
  Controller, Get, Post, Body, Query, UseGuards,
  HttpCode, HttpStatus, Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, TenantId } from '../common/decorators/current-user.decorator';
import { AttendanceMethod } from '@prisma/client';
import { IsOptional, IsEnum, IsNumber, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class CheckInDto {
  @ApiPropertyOptional({ enum: AttendanceMethod })
  @IsOptional()
  @IsEnum(AttendanceMethod)
  method?: AttendanceMethod;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shiftId?: string;
}

@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('check-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Employee check-in' })
  checkIn(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Body() dto: CheckInDto,
  ) {
    const employeeId = user.employee?.id || dto['employeeId'];
    return this.attendanceService.checkIn(
      tenantId,
      employeeId,
      dto.method || 'MANUAL',
      { lat: dto.lat, lng: dto.lng, photo: dto.photo, shiftId: dto.shiftId },
    );
  }

  @Post('check-out')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Employee check-out' })
  checkOut(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Body() dto: CheckInDto,
  ) {
    const employeeId = user.employee?.id || dto['employeeId'];
    return this.attendanceService.checkOut(
      tenantId,
      employeeId,
      dto.method || 'MANUAL',
      { lat: dto.lat, lng: dto.lng, photo: dto.photo },
    );
  }

  @Get('today')
  @ApiOperation({ summary: "Today's attendance overview" })
  getToday(@TenantId() tenantId: string) {
    return this.attendanceService.getTodayAttendance(tenantId);
  }

  @Get('monthly-report')
  @ApiOperation({ summary: 'Monthly attendance report' })
  getMonthlyReport(
    @TenantId() tenantId: string,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.attendanceService.getMonthlyReport(
      tenantId,
      parseInt(month),
      parseInt(year),
    );
  }

  @Get('employee/:id')
  @ApiOperation({ summary: 'Get employee attendance history' })
  getEmployeeAttendance(
    @Param('id') employeeId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.attendanceService.getEmployeeAttendance(
      employeeId,
      new Date(startDate),
      new Date(endDate),
    );
  }
}
