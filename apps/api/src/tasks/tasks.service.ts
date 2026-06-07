import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, filters: { status?: string; assigneeId?: string }) {
    return this.prisma.task.findMany({
      where: {
        tenantId,
        ...(filters.status && { status: filters.status as any }),
        ...(filters.assigneeId && { assignees: { some: { employeeId: filters.assigneeId } } }),
      },
      include: {
        project: { select: { id: true, name: true } },
        assignees: { include: { employee: { select: { id: true, firstName: true, lastName: true, photo: true } } } },
        _count: { select: { subtasks: true } },
      },
      orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }],
    });
  }

  async create(tenantId: string, dto: any) {
    const { assigneeIds, ...taskData } = dto;
    return this.prisma.task.create({
      data: {
        ...taskData,
        tenantId,
        assignees: assigneeIds?.length
          ? { create: assigneeIds.map((id: string) => ({ employeeId: id })) }
          : undefined,
      },
      include: { assignees: { include: { employee: true } } },
    });
  }

  async update(id: string, dto: any) {
    return this.prisma.task.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.status === 'DONE' && { completedAt: new Date() }),
      },
    });
  }

  async getProjects(tenantId: string) {
    return this.prisma.project.findMany({
      where: { tenantId },
      include: { _count: { select: { tasks: true } } },
    });
  }
}
