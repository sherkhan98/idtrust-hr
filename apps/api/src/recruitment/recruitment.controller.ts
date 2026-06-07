import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RecruitmentService } from './recruitment.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantId } from '../common/decorators/current-user.decorator';

@ApiTags('Recruitment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('recruitment')
export class RecruitmentController {
  constructor(private recruitmentService: RecruitmentService) {}

  @Get('vacancies') listVacancies(@TenantId() t: string, @Query('status') s?: string) { return this.recruitmentService.listVacancies(t, s); }
  @Post('vacancies') createVacancy(@TenantId() t: string, @Body() dto: any) { return this.recruitmentService.createVacancy(t, dto); }
  @Put('vacancies/:id') updateVacancy(@Param('id') id: string, @Body() dto: any) { return this.recruitmentService.updateVacancy(id, dto); }
  @Get('vacancies/:id/candidates') getCandidates(@Param('id') id: string) { return this.recruitmentService.getCandidates(id); }
  @Post('vacancies/:id/candidates') addCandidate(@Param('id') id: string, @Body() dto: any) { return this.recruitmentService.addCandidate(id, dto); }
  @Put('candidates/:id/stage') updateStage(@Param('id') id: string, @Body('stage') stage: string) { return this.recruitmentService.updateCandidateStage(id, stage); }
  @Post('candidates/:id/interviews') schedule(@Param('id') id: string, @Body() dto: any) { return this.recruitmentService.scheduleInterview(id, dto); }
  @Get('pipeline-stats') getPipelineStats(@TenantId() t: string) { return this.recruitmentService.getPipelineStats(t); }
}
