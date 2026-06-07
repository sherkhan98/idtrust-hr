import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { AttendanceMethod, AttendanceStatus } from '@prisma/client';
import dayjs from 'dayjs';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async checkIn(
    tenantId: string,
    employeeId: string,
    method: AttendanceMethod = 'MANUAL',
    data: { lat?: number; lng?: number; photo?: string; shiftId?: string },
  ) {
    const today = dayjs().startOf('day').toDate();
    const now = new Date();

    const existing = await this.prisma.attendance.findFirst({
      where: { employeeId, date: { gte: today } },
    });

    if (existing?.checkIn) {
      throw new BadRequestException('Already checked in today');
    }

    let shift: Awaited<ReturnType<typeof this.prisma.shift.findFirst>> = null;
    if (data.shiftId) {
      shift = await this.prisma.shift.findUnique({ where: { id: data.shiftId } });
    } else {
      shift = await this.prisma.shift.findFirst({
        where: { tenantId, status: 'ACTIVE' },
      });
    }

    let lateMinutes = 0;
    let status: AttendanceStatus = 'PRESENT';

    if (shift) {
      const [h, m] = shift.startTime.split(':').map(Number);
      const shiftStart = dayjs().hour(h).minute(m);
      const graceMins = (shift as any).lateGraceMins ?? 10;
      const graceEnd = shiftStart.add(graceMins, 'minute');
      if (dayjs(now).isAfter(graceEnd)) {
        lateMinutes = dayjs(now).diff(shiftStart, 'minute');
        status = 'LATE';
      }
    }

    if (existing) {
      return this.prisma.attendance.update({
        where: { id: existing.id },
        data: {
          checkIn: now,
          checkInMethod: method,
          checkInLat: data.lat,
          checkInLng: data.lng,
          checkInPhoto: data.photo,
          lateMinutes,
          status,
        },
      });
    }

    return this.prisma.attendance.create({
      data: {
        tenantId,
        employeeId,
        shiftId: shift?.id,
        date: today,
        checkIn: now,
        checkInMethod: method,
        checkInLat: data.lat,
        checkInLng: data.lng,
        checkInPhoto: data.photo,
        lateMinutes,
        status,
      },
    });
  }

  async checkOut(
    tenantId: string,
    employeeId: string,
    method: AttendanceMethod = 'MANUAL',
    data: { lat?: number; lng?: number; photo?: string },
  ) {
    const today = dayjs().startOf('day').toDate();
    const now = new Date();

    const attendance = await this.prisma.attendance.findFirst({
      where: { employeeId, date: { gte: today } },
      include: { shift: true },
    });

    if (!attendance) throw new BadRequestException('No check-in found for today');
    if (attendance.checkOut) throw new BadRequestException('Already checked out today');

    const workMinutes = attendance.checkIn
      ? dayjs(now).diff(dayjs(attendance.checkIn), 'minute')
      : 0;

    let overtimeMinutes = 0;
    let earlyLeaveMinutes = 0;

    if (attendance.shift) {
      const [h, m] = attendance.shift.endTime.split(':').map(Number);
      const shiftEnd = dayjs().hour(h).minute(m);
      const overtimeAfterMins = (attendance.shift as any).overtimeAfterMins ?? 30;
      const overtimeThreshold = shiftEnd.add(overtimeAfterMins, 'minute');

      if (dayjs(now).isAfter(overtimeThreshold)) {
        overtimeMinutes = dayjs(now).diff(shiftEnd, 'minute');
      } else if (dayjs(now).isBefore(shiftEnd)) {
        earlyLeaveMinutes = shiftEnd.diff(dayjs(now), 'minute');
      }
    }

    return this.prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        checkOut: now,
        checkOutMethod: method,
        checkOutLat: data.lat,
        checkOutLng: data.lng,
        checkOutPhoto: data.photo,
        workMinutes,
        overtimeMinutes,
        earlyLeaveMinutes,
      },
    });
  }

  async getMonthlyReport(tenantId: string, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendances = await this.prisma.attendance.findMany({
      where: {
        tenantId,
        date: { gte: startDate, lte: endDate },
      },
      include: {
        employee: {
          select: {
            id: true, firstName: true, lastName: true,
            department: { select: { name: true } },
          },
        },
      },
      orderBy: [{ employee: { lastName: 'asc' } }, { date: 'asc' }],
    });

    const summary = await this.prisma.attendance.groupBy({
      by: ['employeeId', 'status'],
      where: { tenantId, date: { gte: startDate, lte: endDate } },
      _count: true,
    });

    return { attendances, summary };
  }

  async getTodayAttendance(tenantId: string) {
    const today = dayjs().startOf('day').toDate();

    return this.prisma.attendance.findMany({
      where: { tenantId, date: { gte: today } },
      include: {
        employee: {
          select: {
            id: true, firstName: true, lastName: true, photo: true,
            department: { select: { name: true } },
            position: { select: { name: true } },
          },
        },
        shift: { select: { name: true, startTime: true, endTime: true } },
      },
      orderBy: { checkIn: 'desc' },
    });
  }

  async getEmployeeAttendance(employeeId: string, startDate: Date, endDate: Date) {
    return this.prisma.attendance.findMany({
      where: {
        employeeId,
        date: { gte: startDate, lte: endDate },
      },
      orderBy: { date: 'desc' },
    });
  }
}
