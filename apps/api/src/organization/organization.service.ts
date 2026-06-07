import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async getBranches(tenantId: string) {
    return this.prisma.branch.findMany({ where: { tenantId }, include: { _count: { select: { employees: true } } } });
  }

  async getDepartments(tenantId: string) {
    return this.prisma.department.findMany({
      where: { tenantId },
      include: {
        parent: { select: { id: true, name: true } },
        _count: { select: { employees: true } },
      },
    });
  }

  async getPositions(tenantId: string) {
    return this.prisma.position.findMany({
      where: { tenantId },
      include: { department: { select: { id: true, name: true } }, _count: { select: { employees: true } } },
    });
  }

  async createBranch(tenantId: string, dto: any) { return this.prisma.branch.create({ data: { ...dto, tenantId } }); }
  async createDepartment(tenantId: string, dto: any) { return this.prisma.department.create({ data: { ...dto, tenantId } }); }
  async createPosition(tenantId: string, dto: any) { return this.prisma.position.create({ data: { ...dto, tenantId } }); }

  async updateBranch(id: string, dto: any) { return this.prisma.branch.update({ where: { id }, data: dto }); }
  async updateDepartment(id: string, dto: any) { return this.prisma.department.update({ where: { id }, data: dto }); }
  async updatePosition(id: string, dto: any) { return this.prisma.position.update({ where: { id }, data: dto }); }
}
