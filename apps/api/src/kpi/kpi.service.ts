import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class KpiService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.kPI.findMany({
      where: { tenantId, status: 'ACTIVE' },
      include: { _count: { select: { scores: true } } },
    });
  }

  async create(tenantId: string, dto: any) {
    return this.prisma.kPI.create({ data: { ...dto, tenantId } });
  }

  async recordScore(dto: {
    kpiId: string;
    employeeId: string;
    period: string;
    actualValue: number;
    note?: string;
    measuredBy?: string;
  }) {
    const kpi = await this.prisma.kPI.findUnique({ where: { id: dto.kpiId } });
    if (!kpi) throw new NotFoundException('KPI not found');

    const target = Number(kpi.targetValue);
    const score = Math.min(100, Math.round((dto.actualValue / target) * 100));

    return this.prisma.kPIScore.upsert({
      where: {
        kpiId_employeeId_period: {
          kpiId: dto.kpiId,
          employeeId: dto.employeeId,
          period: dto.period,
        },
      },
      create: {
        kpiId: dto.kpiId,
        employeeId: dto.employeeId,
        period: dto.period,
        actualValue: dto.actualValue,
        score,
        note: dto.note,
        measuredBy: dto.measuredBy,
        measuredAt: new Date(),
      },
      update: {
        actualValue: dto.actualValue,
        score,
        note: dto.note,
        measuredAt: new Date(),
      },
    });
  }

  async getEmployeeKPI(employeeId: string, period?: string) {
    return this.prisma.kPIScore.findMany({
      where: {
        employeeId,
        ...(period && { period }),
      },
      include: { kpi: true },
      orderBy: { measuredAt: 'desc' },
    });
  }

  async getDepartmentKPI(departmentId: string, period: string) {
    const employees = await this.prisma.employee.findMany({
      where: { departmentId, status: 'ACTIVE' },
      select: { id: true, firstName: true, lastName: true },
    });

    const scores = await Promise.all(
      employees.map(async (emp) => {
        const kpiScores = await this.prisma.kPIScore.findMany({
          where: { employeeId: emp.id, period },
          include: { kpi: { select: { name: true, weight: true } } },
        });

        const totalWeight = kpiScores.reduce((s, k) => s + k.kpi.weight, 0);
        const weightedScore =
          totalWeight > 0
            ? kpiScores.reduce(
                (s, k) => s + (Number(k.score) * k.kpi.weight) / totalWeight,
                0,
              )
            : 0;

        return { employee: emp, scores: kpiScores, overallScore: Math.round(weightedScore) };
      }),
    );

    return scores.sort((a, b) => b.overallScore - a.overallScore);
  }
}
