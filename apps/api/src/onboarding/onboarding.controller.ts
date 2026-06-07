import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingType, OnboardingTaskStatus } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('onboarding')
@UseGuards(JwtAuthGuard)
export class OnboardingController {
  constructor(private readonly service: OnboardingService) {}

  @Get('templates')
  getTemplates(@Req() req: any) {
    return this.service.findTemplates(req.user.tenantId);
  }

  @Post('templates')
  createTemplate(@Req() req: any, @Body() body: any) {
    return this.service.createTemplate(req.user.tenantId, body);
  }

  @Get('workflows')
  getWorkflows(@Req() req: any, @Query('type') type?: string) {
    return this.service.findWorkflows(req.user.tenantId, type as OnboardingType | undefined);
  }

  @Post('workflows')
  startWorkflow(@Req() req: any, @Body() body: any) {
    return this.service.startWorkflow(req.user.tenantId, body);
  }

  @Patch('workflows/:workflowId/tasks/:taskId')
  updateTask(
    @Req() req: any,
    @Param('workflowId') workflowId: string,
    @Param('taskId') taskId: string,
    @Body('status') status: string,
  ) {
    return this.service.updateTask(req.user.tenantId, workflowId, taskId, status as OnboardingTaskStatus);
  }
}
