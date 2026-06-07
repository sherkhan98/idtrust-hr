import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeFilterDto } from './dto/employee-filter.dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class EmployeesService {
  private readonly logger = new Logger(EmployeesService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, filter: EmployeeFilterDto) {
    const {
      page = 1,
      limit = 20,
      search,
      departmentId,
      branchId,
      positionId,
      status,
      workType,
    } = filter;

    const where: Prisma.EmployeeWhereInput = {
      tenantId,
      ...(status && { status }),
      ...(workType && { workType }),
      ...(departmentId && { departmentId }),
      ...(branchId && { branchId }),
      ...(positionId && { positionId }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { employeeCode: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [total, employees] = await Promise.all([
      this.prisma.employee.count({ where }),
      this.prisma.employee.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          department: { select: { id: true, name: true } },
          position: { select: { id: true, name: true } },
          branch: { select: { id: true, name: true } },
          manager: {
            select: { id: true, firstName: true, lastName: true, photo: true },
          },
          user: { select: { id: true, email: true, status: true } },
        },
        orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      }),
    ]);

    return {
      data: employees,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(tenantId: string, id: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id, tenantId },
      include: {
        department: true,
        position: true,
        branch: true,
        manager: {
          select: { id: true, firstName: true, lastName: true, photo: true, position: { select: { name: true } } },
        },
        user: { select: { id: true, email: true, role: true, status: true, mfaEnabled: true } },
        subordinates: {
          select: { id: true, firstName: true, lastName: true, photo: true },
          take: 10,
        },
        attendances: {
          orderBy: { date: 'desc' },
          take: 30,
        },
        leaves: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: { leaveType: true },
        },
        kpiScores: {
          orderBy: { measuredAt: 'desc' },
          take: 10,
          include: { kpi: true },
        },
      },
    });

    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async create(tenantId: string, dto: CreateEmployeeDto) {
    const count = await this.prisma.employee.count({ where: { tenantId } });
    const employeeCode = dto.employeeCode || `EMP${String(count + 1).padStart(4, '0')}`;

    const existing = await this.prisma.employee.findFirst({
      where: { tenantId, employeeCode },
    });
    if (existing) throw new ConflictException('Employee code already exists');

    const { departmentId, positionId, branchId, ...restDto } = dto as any;
    return this.prisma.employee.create({
      data: {
        ...restDto,
        tenantId,
        employeeCode,
        hireDate: new Date(dto.hireDate),
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        contractEndDate: dto.contractEndDate ? new Date(dto.contractEndDate) : undefined,
        passportIssuedAt: dto.passportIssuedAt ? new Date(dto.passportIssuedAt) : undefined,
        passportExpiry: dto.passportExpiry ? new Date(dto.passportExpiry) : undefined,
        ...(departmentId ? { department: { connect: { id: departmentId } } } : {}),
        ...(positionId ? { position: { connect: { id: positionId } } } : {}),
        ...(branchId ? { branch: { connect: { id: branchId } } } : {}),
      },
      include: {
        department: true,
        position: true,
        branch: true,
      },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateEmployeeDto) {
    await this.findOne(tenantId, id);
    return this.prisma.employee.update({
      where: { id },
      data: {
        ...dto,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        contractEndDate: dto.contractEndDate ? new Date(dto.contractEndDate) : undefined,
      },
      include: {
        department: true,
        position: true,
        branch: true,
      },
    });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.employee.update({
      where: { id },
      data: { status: 'TERMINATED' },
    });
    return { message: 'Employee terminated' };
  }

  async getStats(tenantId: string) {
    const [total, active, onLeave, newThisMonth] = await Promise.all([
      this.prisma.employee.count({ where: { tenantId } }),
      this.prisma.employee.count({ where: { tenantId, status: 'ACTIVE' } }),
      this.prisma.employee.count({ where: { tenantId, status: 'ON_LEAVE' } }),
      this.prisma.employee.count({
        where: {
          tenantId,
          createdAt: { gte: new Date(new Date().setDate(1)) },
        },
      }),
    ]);

    const byDept = await this.prisma.department.findMany({
      where: { tenantId },
      include: {
        _count: { select: { employees: true } },
      },
    });

    return { total, active, onLeave, newThisMonth, byDepartment: byDept };
  }

  async getOrgChart(tenantId: string) {
    const employees = await this.prisma.employee.findMany({
      where: { tenantId, status: 'ACTIVE' },
      select: {
        id: true, firstName: true, lastName: true, photo: true, managerId: true,
        position: { select: { name: true } },
        department: { select: { name: true } },
      },
    });
    return employees;
  }

  async createWithAccount(tenantId: string, dto: CreateEmployeeDto & {
    account?: {
      createAccount: boolean;
      appEmail?: string;
      appPassword?: string;
      telegramId?: string;
      sendWelcome?: boolean;
      permissions?: {
        viewAttendance?: boolean;
        viewSalary?: boolean;
        requestLeave?: boolean;
        viewKpi?: boolean;
        downloadDocuments?: boolean;
        viewColleagues?: boolean;
      };
    };
  }) {
    const { account, ...employeeData } = dto;
    const count = await this.prisma.employee.count({ where: { tenantId } });
    const employeeCode = employeeData.employeeCode || `EMP${String(count + 1).padStart(4, '0')}`;

    const existing = await this.prisma.employee.findFirst({ where: { tenantId, employeeCode } });
    if (existing) throw new ConflictException('Employee code already exists');

    let userId: string | undefined;

    if (account?.createAccount && account.appEmail) {
      const existingUser = await this.prisma.user.findUnique({ where: { email: account.appEmail } });
      if (existingUser) throw new ConflictException('Email already registered');

      const password = account.appPassword || this.generatePassword();
      const passwordHash = await bcrypt.hash(password, 12);

      const user = await this.prisma.user.create({
        data: {
          tenantId,
          email: account.appEmail.toLowerCase(),
          passwordHash,
          firstName: employeeData.firstName,
          lastName: employeeData.lastName,
          phone: employeeData.phone,
          telegramChatId: account.telegramId || null,
          role: 'EMPLOYEE',
          status: 'ACTIVE',
        },
      });
      userId = user.id;
    }

    const employee = await this.prisma.employee.create({
      data: {
        ...employeeData,
        tenantId,
        employeeCode,
        userId,
        hireDate: new Date(employeeData.hireDate),
        dateOfBirth: employeeData.dateOfBirth ? new Date(employeeData.dateOfBirth) : undefined,
        contractEndDate: employeeData.contractEndDate ? new Date(employeeData.contractEndDate) : undefined,
        passportIssuedAt: employeeData.passportIssuedAt ? new Date(employeeData.passportIssuedAt) : undefined,
        passportExpiry: employeeData.passportExpiry ? new Date(employeeData.passportExpiry) : undefined,
        appPermissions: account?.permissions ? JSON.stringify(account.permissions) : JSON.stringify({
          viewAttendance: true, viewSalary: false, requestLeave: true,
          viewKpi: true, downloadDocuments: false, viewColleagues: true,
        }),
      } as any,
      include: { department: true, position: true, branch: true, user: { select: { id: true, email: true, role: true } } },
    });

    return {
      employee,
      account: account?.createAccount ? {
        email: account.appEmail,
        passwordCreated: true,
        welcomeSent: account.sendWelcome || false,
      } : null,
    };
  }

  async updatePermissions(tenantId: string, employeeId: string, permissions: Record<string, boolean>) {
    const emp = await this.prisma.employee.findFirst({ where: { id: employeeId, tenantId } });
    if (!emp) throw new NotFoundException('Employee not found');

    return this.prisma.employee.update({
      where: { id: employeeId },
      data: { appPermissions: JSON.stringify(permissions) } as any,
    });
  }

  async resetPassword(tenantId: string, employeeId: string, newPassword?: string) {
    const emp = await this.prisma.employee.findFirst({
      where: { id: employeeId, tenantId },
      include: { user: true },
    });
    if (!emp || !emp.user) throw new NotFoundException('Employee account not found');

    const password = newPassword || this.generatePassword();
    const passwordHash = await bcrypt.hash(password, 12);

    await this.prisma.user.update({
      where: { id: emp.userId! },
      data: { passwordHash },
    });

    return { success: true, email: emp.user.email, newPassword: password };
  }

  async getMyProfile(tenantId: string, userId: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { tenantId, userId },
      include: {
        department: true, position: true, branch: true,
        manager: { select: { id: true, firstName: true, lastName: true } },
        user: { select: { id: true, email: true, telegramChatId: true, lastLoginAt: true } },
        attendances: { orderBy: { date: 'desc' }, take: 31 },
        leaves: { orderBy: { createdAt: 'desc' }, take: 10, include: { leaveType: true } },
      },
    });
    if (!employee) throw new NotFoundException('Profile not found');

    const permissions = employee['appPermissions'] ?
      JSON.parse(employee['appPermissions'] as string) :
      { viewAttendance: true, viewSalary: false, requestLeave: true, viewKpi: true, downloadDocuments: false, viewColleagues: true };

    return { ...employee, permissions };
  }

  private generatePassword(): string {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!';
    return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }
}
