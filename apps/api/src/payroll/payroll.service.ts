import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import dayjs from 'dayjs';
import { Decimal } from '@prisma/client/runtime/library';

const INCOME_TAX_RATE = 0.12;    // Uzbekistan 12%
const SOCIAL_TAX_RATE = 0.25;    // Employer 25%
const PENSION_FUND_RATE = 0.08;  // Employee 8%

@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}

  async createPeriod(tenantId: string, dto: { name: string; startDate: string; endDate: string }) {
    return this.prisma.payrollPeriod.create({
      data: {
        tenantId,
        name: dto.name,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
      },
    });
  }

  async listPeriods(tenantId: string) {
    return this.prisma.payrollPeriod.findMany({
      where: { tenantId },
      include: {
        _count: { select: { payrolls: true } },
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async calculatePayroll(tenantId: string, periodId: string) {
    const period = await this.prisma.payrollPeriod.findFirst({
      where: { id: periodId, tenantId },
    });
    if (!period) throw new NotFoundException('Payroll period not found');
    if (period.status !== 'DRAFT') throw new BadRequestException('Period already processed');

    const employees = await this.prisma.employee.findMany({
      where: { tenantId, status: 'ACTIVE' },
    });

    const workDays = this.getWorkDays(period.startDate, period.endDate);

    await this.prisma.payrollPeriod.update({
      where: { id: periodId },
      data: { status: 'PROCESSING' },
    });

    const payrollData = await Promise.all(
      employees.map(async (emp) => {
        const attendance = await this.prisma.attendance.aggregate({
          where: {
            employeeId: emp.id,
            date: { gte: period.startDate, lte: period.endDate },
            status: { in: ['PRESENT', 'LATE'] },
          },
          _count: { id: true },
          _sum: { overtimeMinutes: true },
        });

        const workedDays = attendance._count.id;
        const overtimeHours = (attendance._sum.overtimeMinutes || 0) / 60;
        const dailyRate = Number(emp.baseSalary) / workDays;
        const salaryForWorkedDays = dailyRate * workedDays;
        const overtimePay = (Number(emp.baseSalary) / workDays / 8) * 1.5 * overtimeHours;

        const bonuses = await this.prisma.employeePayroll.aggregate({
          where: { employeeId: emp.id, periodId },
          _sum: { bonuses: true },
        });

        const penalties = await this.prisma.employeePayroll.aggregate({
          where: { employeeId: emp.id, periodId },
          _sum: { penalties: true },
        });

        const grossSalary =
          salaryForWorkedDays +
          overtimePay +
          Number(bonuses._sum.bonuses || 0) -
          Number(penalties._sum.penalties || 0);

        const incomeTax = grossSalary * INCOME_TAX_RATE;
        const socialTax = grossSalary * SOCIAL_TAX_RATE;
        const pensionFund = grossSalary * PENSION_FUND_RATE;
        const netSalary = grossSalary - incomeTax - pensionFund;

        return {
          periodId,
          employeeId: emp.id,
          baseSalary: emp.baseSalary,
          workDays,
          workedDays,
          overtimeHours,
          overtimePay,
          bonuses: 0,
          penalties: 0,
          grossSalary,
          incomeTax,
          socialTax,
          pensionFund,
          netSalary,
          currency: emp.currency,
          status: 'PENDING' as const,
        };
      }),
    );

    await this.prisma.employeePayroll.createMany({
      data: payrollData,
      skipDuplicates: true,
    });

    await this.prisma.payrollPeriod.update({
      where: { id: periodId },
      data: { status: 'COMPLETED', processedAt: new Date() },
    });

    return { processed: payrollData.length, periodId };
  }

  async getPeriodPayrolls(tenantId: string, periodId: string) {
    return this.prisma.employeePayroll.findMany({
      where: { period: { id: periodId, tenantId } },
      include: {
        employee: {
          select: {
            id: true, firstName: true, lastName: true, employeeCode: true,
            department: { select: { name: true } },
            position: { select: { name: true } },
          },
        },
      },
      orderBy: { employee: { lastName: 'asc' } },
    });
  }

  async getEmployeePayrollHistory(employeeId: string) {
    return this.prisma.employeePayroll.findMany({
      where: { employeeId },
      include: { period: true },
      orderBy: { createdAt: 'desc' },
      take: 24,
    });
  }

  private getWorkDays(start: Date, end: Date): number {
    let count = 0;
    const current = dayjs(start);
    const endDate = dayjs(end);
    let d = current;
    while (d.isBefore(endDate) || d.isSame(endDate, 'day')) {
      const dow = d.day();
      if (dow !== 0 && dow !== 6) count++;
      d = d.add(1, 'day');
    }
    return count;
  }
}
