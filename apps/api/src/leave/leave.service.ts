import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import dayjs from 'dayjs';

@Injectable()
export class LeaveService {
  constructor(private prisma: PrismaService) {}

  async getLeaveTypes(tenantId: string) {
    return this.prisma.leaveType.findMany({
      where: { tenantId, status: 'ACTIVE' },
    });
  }

  async applyLeave(
    tenantId: string,
    employeeId: string,
    dto: {
      leaveTypeId: string;
      startDate: string;
      endDate: string;
      reason?: string;
      attachments?: string[];
    },
  ) {
    const start = dayjs(dto.startDate);
    const end = dayjs(dto.endDate);
    const days = end.diff(start, 'day') + 1;

    if (days <= 0) throw new BadRequestException('Invalid date range');

    const overlapping = await this.prisma.leave.findFirst({
      where: {
        employeeId,
        status: { in: ['PENDING', 'APPROVED'] },
        OR: [
          {
            startDate: { lte: end.toDate() },
            endDate: { gte: start.toDate() },
          },
        ],
      },
    });

    if (overlapping) {
      throw new BadRequestException('Overlapping leave request exists');
    }

    return this.prisma.leave.create({
      data: {
        tenantId,
        employeeId,
        leaveTypeId: dto.leaveTypeId,
        startDate: start.toDate(),
        endDate: end.toDate(),
        days,
        reason: dto.reason,
        attachments: dto.attachments || [],
        status: 'PENDING',
      },
      include: { leaveType: true },
    });
  }

  async approveLeave(id: string, approverId: string) {
    const leave = await this.prisma.leave.findUnique({ where: { id } });
    if (!leave) throw new NotFoundException('Leave not found');
    if (leave.status !== 'PENDING') {
      throw new BadRequestException('Leave is not pending');
    }

    const [updated] = await Promise.all([
      this.prisma.leave.update({
        where: { id },
        data: { status: 'APPROVED', approvedById: approverId, approvedAt: new Date() },
        include: { leaveType: true, employee: { select: { firstName: true, lastName: true } } },
      }),
      this.prisma.employee.update({
        where: { id: leave.employeeId },
        data: { status: 'ON_LEAVE' },
      }),
    ]);

    return updated;
  }

  async rejectLeave(id: string, approverId: string, reason?: string) {
    const leave = await this.prisma.leave.findUnique({ where: { id } });
    if (!leave) throw new NotFoundException('Leave not found');
    if (leave.status !== 'PENDING') {
      throw new BadRequestException('Leave is not pending');
    }

    return this.prisma.leave.update({
      where: { id },
      data: {
        status: 'REJECTED',
        approvedById: approverId,
        approvedAt: new Date(),
        rejectedReason: reason,
      },
    });
  }

  async listLeaves(tenantId: string, filters: { employeeId?: string; status?: string }) {
    return this.prisma.leave.findMany({
      where: {
        tenantId,
        ...(filters.employeeId && { employeeId: filters.employeeId }),
        ...(filters.status && { status: filters.status as any }),
      },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, photo: true } },
        leaveType: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getLeaveBalance(employeeId: string, tenantId: string) {
    const leaveTypes = await this.prisma.leaveType.findMany({
      where: { tenantId, status: 'ACTIVE' },
    });

    const usedLeaves = await this.prisma.leave.groupBy({
      by: ['leaveTypeId'],
      where: {
        employeeId,
        status: 'APPROVED',
        startDate: { gte: dayjs().startOf('year').toDate() },
      },
      _sum: { days: true },
    });

    const usedMap = Object.fromEntries(
      usedLeaves.map((l) => [l.leaveTypeId, l._sum.days || 0]),
    );

    return leaveTypes.map((lt) => ({
      leaveType: lt,
      allocated: lt.daysPerYear,
      used: usedMap[lt.id] || 0,
      remaining: lt.daysPerYear - (usedMap[lt.id] || 0),
    }));
  }
}
