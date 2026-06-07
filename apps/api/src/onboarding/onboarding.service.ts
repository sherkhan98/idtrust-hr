import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { OnboardingType, OnboardingTaskStatus } from '@prisma/client';

@Injectable()
export class OnboardingService {
  constructor(private prisma: PrismaService) {}

  findTemplates(tenantId: string) {
    return this.prisma.onboardingTemplate.findMany({
      where: { tenantId },
      include: { tasks: { orderBy: { order: 'asc' } } },
    });
  }

  async createTemplate(tenantId: string, data: {
    name: string; type: OnboardingType; department?: string;
    tasks: { title: string; description?: string; category: string; assignedRole: string; dueOffsetDays: number; required: boolean; order: number }[];
  }) {
    return this.prisma.onboardingTemplate.create({
      data: {
        tenantId,
        name: data.name,
        type: data.type,
        department: data.department,
        tasks: { create: data.tasks as any },
      },
      include: { tasks: true },
    });
  }

  findWorkflows(tenantId: string, type?: OnboardingType) {
    return this.prisma.onboardingWorkflow.findMany({
      where: { tenantId, ...(type && { type }) },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, position: true, department: { select: { name: true } } } },
        tasks: { orderBy: { dueDate: 'asc' } },
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async startWorkflow(tenantId: string, data: {
    employeeId: string;
    type: OnboardingType;
    templateId?: string;
    startDate: string;
  }) {
    let tasks: any[] = [];

    if (data.templateId) {
      const template = await this.prisma.onboardingTemplate.findFirst({
        where: { id: data.templateId, tenantId },
        include: { tasks: { orderBy: { order: 'asc' } } },
      });
      if (!template) throw new NotFoundException('Template not found');
      const start = new Date(data.startDate);
      tasks = template.tasks.map(t => ({
        title: t.title,
        description: t.description,
        category: t.category,
        assignedRole: t.assignedRole,
        dueDate: new Date(start.getTime() + t.dueOffsetDays * 86400000),
        status: 'PENDING',
      }));
    }

    return this.prisma.onboardingWorkflow.create({
      data: {
        tenantId,
        employeeId: data.employeeId,
        type: data.type,
        templateId: data.templateId,
        startDate: new Date(data.startDate),
        tasks: { create: tasks },
      },
      include: { tasks: true },
    });
  }

  async updateTask(tenantId: string, workflowId: string, taskId: string, status: OnboardingTaskStatus) {
    const workflow = await this.prisma.onboardingWorkflow.findFirst({ where: { id: workflowId, tenantId } });
    if (!workflow) throw new NotFoundException('Workflow not found');

    const task = await this.prisma.onboardingTask.update({
      where: { id: taskId },
      data: { status, completedAt: status === 'DONE' ? new Date() : null },
    });

    const allTasks = await this.prisma.onboardingTask.findMany({ where: { workflowId } });
    const allDone = allTasks.every(t => t.status === 'DONE' || t.status === 'SKIPPED');
    if (allDone) {
      await this.prisma.onboardingWorkflow.update({ where: { id: workflowId }, data: { completedAt: new Date() } });
    }

    return task;
  }

  getWorkflowProgress(workflow: any) {
    const total = workflow.tasks.length;
    const done = workflow.tasks.filter((t: any) => t.status === 'DONE' || t.status === 'SKIPPED').length;
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }
}
