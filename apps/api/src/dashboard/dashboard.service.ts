import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import dayjs from 'dayjs';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getCEODashboard(tenantId: string) {
    const today = dayjs().startOf('day').toDate();
    const thisMonth = dayjs().startOf('month').toDate();
    const lastMonth = dayjs().subtract(1, 'month').startOf('month').toDate();
    const lastMonthEnd = dayjs().subtract(1, 'month').endOf('month').toDate();

    const [
      totalEmployees,
      activeEmployees,
      todayPresent,
      todayAbsent,
      pendingLeaves,
      openVacancies,
      openTickets,
      monthlyPayroll,
      lastMonthPayroll,
      departmentHeadcount,
      recentAttendance,
      turnoverThisYear,
    ] = await Promise.all([
      this.prisma.employee.count({ where: { tenantId } }),
      this.prisma.employee.count({ where: { tenantId, status: 'ACTIVE' } }),
      this.prisma.attendance.count({
        where: {
          tenantId,
          date: { gte: today },
          status: { in: ['PRESENT', 'LATE'] },
        },
      }),
      this.prisma.attendance.count({
        where: { tenantId, date: { gte: today }, status: 'ABSENT' },
      }),
      this.prisma.leave.count({
        where: { tenantId, status: 'PENDING' },
      }),
      this.prisma.vacancy.count({
        where: { tenantId, status: 'PUBLISHED' },
      }),
      this.prisma.ticket.count({
        where: { tenantId, status: { in: ['OPEN', 'IN_PROGRESS'] } },
      }),
      this.prisma.employeePayroll.aggregate({
        _sum: { grossSalary: true, netSalary: true },
        where: {
          period: {
            tenantId,
            startDate: { gte: thisMonth },
          },
        },
      }),
      this.prisma.employeePayroll.aggregate({
        _sum: { grossSalary: true, netSalary: true },
        where: {
          period: {
            tenantId,
            startDate: { gte: lastMonth, lte: lastMonthEnd },
          },
        },
      }),
      this.prisma.department.findMany({
        where: { tenantId, status: 'ACTIVE' },
        include: {
          _count: { select: { employees: { where: { status: 'ACTIVE' } } } },
        },
      }),
      this.prisma.attendance.groupBy({
        by: ['date', 'status'],
        where: {
          tenantId,
          date: { gte: dayjs().subtract(30, 'days').toDate() },
        },
        _count: true,
        orderBy: { date: 'asc' },
      }),
      this.prisma.employee.count({
        where: {
          tenantId,
          status: { in: ['RESIGNED', 'TERMINATED'] },
          resignDate: { gte: dayjs().startOf('year').toDate() },
        },
      }),
    ]);

    const attendanceRate = totalEmployees > 0
      ? Math.round((todayPresent / activeEmployees) * 100)
      : 0;

    const payrollGrowth = lastMonthPayroll._sum.grossSalary
      ? Number(
          (
            ((Number(monthlyPayroll._sum.grossSalary) -
              Number(lastMonthPayroll._sum.grossSalary)) /
              Number(lastMonthPayroll._sum.grossSalary)) *
            100
          ).toFixed(1),
        )
      : 0;

    const turnoverRate =
      totalEmployees > 0
        ? Number(((turnoverThisYear / totalEmployees) * 100).toFixed(1))
        : 0;

    return {
      stats: {
        totalEmployees,
        activeEmployees,
        todayPresent,
        todayAbsent,
        attendanceRate,
        pendingLeaves,
        openVacancies,
        openTickets,
        turnoverRate,
      },
      payroll: {
        thisMonth: {
          gross: Number(monthlyPayroll._sum.grossSalary || 0),
          net: Number(monthlyPayroll._sum.netSalary || 0),
        },
        growth: payrollGrowth,
      },
      departmentHeadcount: departmentHeadcount.map((d) => ({
        id: d.id,
        name: d.name,
        count: d._count.employees,
      })),
      recentAttendance,
    };
  }

  async getHRDashboard(tenantId: string) {
    const thisMonth = dayjs().startOf('month').toDate();

    const [
      newHires,
      resignations,
      leaveRequests,
      leaveApprovalRate,
      avgAttendance,
      upcomingBirthdays,
      contractsExpiring,
      probationEnding,
    ] = await Promise.all([
      this.prisma.employee.count({
        where: { tenantId, hireDate: { gte: thisMonth } },
      }),
      this.prisma.employee.count({
        where: {
          tenantId,
          resignDate: { gte: thisMonth },
          status: { in: ['RESIGNED', 'TERMINATED'] },
        },
      }),
      this.prisma.leave.groupBy({
        by: ['status'],
        where: { tenantId, createdAt: { gte: thisMonth } },
        _count: true,
      }),
      this.prisma.leave.count({
        where: { tenantId, status: 'APPROVED', createdAt: { gte: thisMonth } },
      }),
      this.prisma.attendance.aggregate({
        _avg: { workMinutes: true },
        where: {
          tenantId,
          date: { gte: thisMonth },
          status: 'PRESENT',
        },
      }),
      this.prisma.employee.findMany({
        where: {
          tenantId,
          status: 'ACTIVE',
          dateOfBirth: {
            not: null,
          },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          photo: true,
          department: { select: { name: true } },
        },
        take: 10,
      }),
      this.prisma.employee.count({
        where: {
          tenantId,
          contractEndDate: {
            gte: new Date(),
            lte: dayjs().add(30, 'days').toDate(),
          },
        },
      }),
      this.prisma.employee.count({
        where: {
          tenantId,
          probationEndDate: {
            gte: new Date(),
            lte: dayjs().add(7, 'days').toDate(),
          },
        },
      }),
    ]);

    return {
      newHires,
      resignations,
      leaveRequests: Object.fromEntries(
        leaveRequests.map((l) => [l.status, l._count]),
      ),
      avgWorkHours: Number(
        ((avgAttendance._avg.workMinutes || 0) / 60).toFixed(1),
      ),
      upcomingBirthdays,
      contractsExpiring,
      probationEnding,
    };
  }

  async getEmployeeDashboard(tenantId: string, employeeId: string) {
    const today = dayjs().startOf('day').toDate();
    const thisMonth = dayjs().startOf('month').toDate();

    const [
      todayAttendance,
      monthlyAttendance,
      pendingLeave,
      leaveBalance,
      myTasks,
      recentPayroll,
      kpiScores,
    ] = await Promise.all([
      this.prisma.attendance.findFirst({
        where: { employeeId, date: { gte: today } },
      }),
      this.prisma.attendance.aggregate({
        _sum: { workMinutes: true, overtimeMinutes: true },
        _count: { id: true },
        where: {
          employeeId,
          date: { gte: thisMonth },
          status: { in: ['PRESENT', 'LATE'] },
        },
      }),
      this.prisma.leave.count({
        where: { employeeId, status: 'PENDING' },
      }),
      this.prisma.leave.groupBy({
        by: ['leaveTypeId'],
        where: { employeeId, status: 'APPROVED' },
        _sum: { days: true },
        _count: { id: true },
      }),
      this.prisma.task.findMany({
        where: {
          assignees: { some: { employeeId } },
          status: { in: ['TODO', 'IN_PROGRESS'] },
        },
        orderBy: { dueDate: 'asc' },
        take: 5,
        include: { project: { select: { name: true } } },
      }),
      this.prisma.employeePayroll.findFirst({
        where: { employeeId },
        orderBy: { createdAt: 'desc' },
        include: { period: true },
      }),
      this.prisma.kPIScore.findMany({
        where: { employeeId },
        orderBy: { measuredAt: 'desc' },
        take: 5,
        include: { kpi: { select: { name: true, unit: true } } },
      }),
    ]);

    return {
      todayAttendance,
      monthlyStats: {
        workedDays: monthlyAttendance._count.id,
        totalHours: Number(
          ((monthlyAttendance._sum.workMinutes || 0) / 60).toFixed(1),
        ),
        overtimeHours: Number(
          ((monthlyAttendance._sum.overtimeMinutes || 0) / 60).toFixed(1),
        ),
      },
      pendingLeave,
      myTasks,
      recentPayroll,
      kpiScores,
    };
  }
}
