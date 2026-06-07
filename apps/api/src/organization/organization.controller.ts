import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantId } from '../common/decorators/current-user.decorator';

@ApiTags('Organization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organization')
export class OrganizationController {
  constructor(private orgService: OrganizationService) {}

  @Get('branches') getBranches(@TenantId() t: string) { return this.orgService.getBranches(t); }
  @Post('branches') createBranch(@TenantId() t: string, @Body() dto: any) { return this.orgService.createBranch(t, dto); }
  @Put('branches/:id') updateBranch(@Param('id') id: string, @Body() dto: any) { return this.orgService.updateBranch(id, dto); }

  @Get('departments') getDepartments(@TenantId() t: string) { return this.orgService.getDepartments(t); }
  @Post('departments') createDept(@TenantId() t: string, @Body() dto: any) { return this.orgService.createDepartment(t, dto); }
  @Put('departments/:id') updateDept(@Param('id') id: string, @Body() dto: any) { return this.orgService.updateDepartment(id, dto); }

  @Get('positions') getPositions(@TenantId() t: string) { return this.orgService.getPositions(t); }
  @Post('positions') createPosition(@TenantId() t: string, @Body() dto: any) { return this.orgService.createPosition(t, dto); }
  @Put('positions/:id') updatePosition(@Param('id') id: string, @Body() dto: any) { return this.orgService.updatePosition(id, dto); }
}
