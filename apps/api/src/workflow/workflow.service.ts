import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

export type StepType = 'APPROVAL' | 'NOTIFICATION' | 'CONDITION' | 'TIMER' | 'INTEGRATION' | 'FORM';

export interface WorkflowStep {
  id: string;
  type: StepType;
  name: string;
  order: number;
  config: {
    assignedRole?: string;
    assignedUserId?: string;
    slaHours?: number;
    escalationRole?: string;
    channel?: 'EMAIL' | 'TELEGRAM' | 'SMS' | 'IN_APP';
    messageTemplate?: string;
    conditionField?: string;
    conditionOperator?: string;
    conditionValue?: string;
    waitHours?: number;
    integrationId?: string;
  };
  trueStepId?: string;
  falseStepId?: string;
  nextStepId?: string;
}

@Injectable()
export class WorkflowService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.customWorkflow.findMany({
      where: { tenantId },
      include: {
        steps: { orderBy: { order: 'asc' } },
        _count: { select: { instances: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const wf = await this.prisma.customWorkflow.findFirst({
      where: { id, tenantId },
      include: { steps: { orderBy: { order: 'asc' } } },
    });
    if (!wf) throw new NotFoundException('Workflow not found');
    return wf;
  }

  async create(tenantId: string, userId: string, data: {
    name: string;
    trigger: string;
    description?: string;
    steps: Omit<WorkflowStep, 'id'>[];
  }) {
    return this.prisma.customWorkflow.create({
      data: {
        tenantId,
        createdById: userId,
        name: data.name,
        trigger: data.trigger,
        description: data.description,
        status: 'DRAFT',
        steps: {
          create: data.steps.map((step) => ({
            type: step.type,
            name: step.name,
            order: step.order,
            config: step.config,
            trueStepId: step.trueStepId,
            falseStepId: step.falseStepId,
            nextStepId: step.nextStepId,
          })),
        },
      },
      include: { steps: true },
    });
  }

  async update(tenantId: string, id: string, data: any) {
    const wf = await this.prisma.customWorkflow.findFirst({ where: { id, tenantId } });
    if (!wf) throw new NotFoundException('Workflow not found');

    if (data.steps) {
      await this.prisma.workflowStep.deleteMany({ where: { workflowId: id } });
      return this.prisma.customWorkflow.update({
        where: { id },
        data: {
          ...data,
          steps: { create: data.steps },
          updatedAt: new Date(),
        },
        include: { steps: true },
      });
    }

    return this.prisma.customWorkflow.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async activate(tenantId: string, id: string) {
    return this.update(tenantId, id, { status: 'ACTIVE' });
  }

  async delete(tenantId: string, id: string) {
    const wf = await this.prisma.customWorkflow.findFirst({ where: { id, tenantId } });
    if (!wf) throw new NotFoundException('Workflow not found');
    await this.prisma.workflowStep.deleteMany({ where: { workflowId: id } });
    return this.prisma.customWorkflow.delete({ where: { id } });
  }

  async startInstance(tenantId: string, workflowId: string, triggeredById: string, data: any) {
    const wf = await this.findOne(tenantId, workflowId);
    if (wf.status !== 'ACTIVE') throw new Error('Workflow is not active');

    const firstStep = (wf.steps as any[])[0];
    return this.prisma.workflowInstance.create({
      data: {
        tenantId,
        workflowId,
        triggeredById,
        currentStepId: firstStep?.id,
        status: 'RUNNING',
        data,
      },
    });
  }

  async getInstances(tenantId: string, workflowId?: string) {
    return this.prisma.workflowInstance.findMany({
      where: { tenantId, ...(workflowId && { workflowId }) },
      include: {
        workflow: { select: { name: true } },
        triggeredBy: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async getTemplates() {
    return [
      {
        id: 'leave-approval', name: "Ta'til tasdiqlash",
        trigger: 'LEAVE_REQUEST', steps: 3, description: 'Xodim → Rahbar → HR',
      },
      {
        id: 'onboarding', name: 'Yangi xodim onboarding',
        trigger: 'NEW_EMPLOYEE', steps: 8, description: 'IT, HR, Rahbar vazifalar',
      },
      {
        id: 'expense', name: 'Xarajat tasdiqlash',
        trigger: 'EXPENSE_SUBMIT', steps: 4, description: 'Xodim → Rahbar → Moliya',
      },
      {
        id: 'offboarding', name: 'Ishdan bo\'shatish',
        trigger: 'TERMINATION', steps: 6, description: 'HR, IT, Moliya checklist',
      },
    ];
  }
}
