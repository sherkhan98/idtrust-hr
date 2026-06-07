import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class RecruitmentService {
  constructor(private prisma: PrismaService) {}

  async listVacancies(tenantId: string, status?: string) {
    return this.prisma.vacancy.findMany({
      where: { tenantId, ...(status && { status: status as any }) },
      include: {
        _count: { select: { candidates: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createVacancy(tenantId: string, dto: any) {
    return this.prisma.vacancy.create({ data: { ...dto, tenantId } });
  }

  async updateVacancy(id: string, dto: any) {
    return this.prisma.vacancy.update({ where: { id }, data: dto });
  }

  async getCandidates(vacancyId: string) {
    return this.prisma.candidate.findMany({
      where: { vacancyId },
      include: { interviews: { orderBy: { scheduledAt: 'desc' }, take: 1 } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addCandidate(vacancyId: string, dto: any) {
    return this.prisma.candidate.create({ data: { ...dto, vacancyId } });
  }

  async updateCandidateStage(id: string, stage: string) {
    return this.prisma.candidate.update({
      where: { id },
      data: { stage: stage as any },
    });
  }

  async scheduleInterview(candidateId: string, dto: any) {
    return this.prisma.interview.create({
      data: { ...dto, candidateId },
    });
  }

  async getPipelineStats(tenantId: string) {
    const stages = await this.prisma.candidate.groupBy({
      by: ['stage'],
      where: { vacancy: { tenantId } },
      _count: true,
    });

    return stages.map((s) => ({ stage: s.stage, count: s._count }));
  }
}
