import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

export interface AnomalyRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  enabled: boolean;
}

@Injectable()
export class SecurityService {
  private readonly anomalyRules: AnomalyRule[] = [
    { id: '1', name: 'Off-hours login', condition: 'login_hour < 6 OR login_hour > 23', threshold: 1, riskLevel: 'CRITICAL', enabled: true },
    { id: '2', name: 'Bulk file download', condition: 'file_downloads > 50', threshold: 50, riskLevel: 'HIGH', enabled: true },
    { id: '3', name: 'Multiple password changes', condition: 'password_changes > 2', threshold: 2, riskLevel: 'HIGH', enabled: true },
    { id: '4', name: 'New device login', condition: 'new_device = true', threshold: 1, riskLevel: 'MEDIUM', enabled: true },
    { id: '5', name: 'Multiple failed logins', condition: 'failed_logins > 3', threshold: 3, riskLevel: 'MEDIUM', enabled: true },
    { id: '6', name: 'Login from new country', condition: 'new_country = true', threshold: 1, riskLevel: 'HIGH', enabled: true },
    { id: '7', name: 'Mass data export', condition: 'export_records > 1000', threshold: 1000, riskLevel: 'CRITICAL', enabled: true },
  ];

  constructor(private prisma: PrismaService) {}

  async getAuditLogs(tenantId: string, filters?: {
    userId?: string;
    action?: string;
    from?: Date;
    to?: Date;
    page?: number;
    limit?: number;
  }) {
    const { page = 1, limit = 50, ...where } = filters || {};
    return this.prisma.auditLog.findMany({
      where: {
        tenantId,
        ...(where.userId && { userId: where.userId }),
        ...(where.action && { action: where.action }),
        ...(where.from && where.to && { createdAt: { gte: where.from, lte: where.to } }),
      },
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async getAnomalyAlerts(tenantId: string) {
    return this.prisma.auditLog.findMany({
      where: {
        tenantId,
        riskLevel: { in: ['HIGH', 'CRITICAL'] },
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async updateAnomalyStatus(tenantId: string, logId: string, status: string) {
    return this.prisma.auditLog.update({
      where: { id: logId, tenantId },
      data: { status } as any,
    });
  }

  getAnomalyRules() {
    return this.anomalyRules;
  }

  async checkAnomaly(tenantId: string, event: {
    userId: string;
    action: string;
    hour: number;
    ipAddress: string;
    userAgent: string;
    metadata?: Record<string, any>;
  }) {
    const alerts: { rule: string; riskLevel: string }[] = [];

    if (event.hour < 6 || event.hour > 23) {
      alerts.push({ rule: 'Off-hours login', riskLevel: 'CRITICAL' });
    }

    if (event.metadata?.fileDownloads > 50) {
      alerts.push({ rule: 'Bulk file download', riskLevel: 'HIGH' });
    }

    // Log to audit
    await this.prisma.auditLog.create({
      data: {
        tenantId,
        userId: event.userId,
        action: event.action,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
        riskLevel: alerts.length > 0 ? alerts[0].riskLevel : 'LOW',
        metadata: event.metadata || {},
      } as any,
    });

    return alerts;
  }

  async getDataResidencyConfig(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { settings: true },
    });
    return (tenant?.settings as any)?.dataResidency || {
      primaryRegion: 'uz',
      gdprEnabled: false,
      retentionYears: 3,
      backupSchedule: 'daily',
    };
  }

  async updateDataResidencyConfig(tenantId: string, config: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    const currentSettings = (tenant?.settings as any) || {};
    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: { settings: { ...currentSettings, dataResidency: config } },
    });
  }
}
