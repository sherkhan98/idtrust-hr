import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantId } from '../common/decorators/current-user.decorator';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get() findAll(@TenantId() t: string, @Query('status') s?: string, @Query('assigneeId') a?: string) { return this.tasksService.findAll(t, { status: s, assigneeId: a }); }
  @Post() create(@TenantId() t: string, @Body() dto: any) { return this.tasksService.create(t, dto); }
  @Put(':id') update(@Param('id') id: string, @Body() dto: any) { return this.tasksService.update(id, dto); }
  @Get('projects') getProjects(@TenantId() t: string) { return this.tasksService.getProjects(t); }
}
