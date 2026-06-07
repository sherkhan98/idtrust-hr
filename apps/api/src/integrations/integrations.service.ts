import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { IntegrationType, IntegrationSyncStatus } from '@prisma/client';
import { CreateIntegrationDto, UpdateIntegrationDto } from './dto/integration.dto';
import { OneCAdapter } from './adapters/onec.adapter';
import { UzAsboAdapter } from './adapters/uzasbo.adapter';
import { BitrixAdapter } from './adapters/bitrix.adapter';

@Injectable()
export class IntegrationsService {
  constructor(
    private prisma: PrismaService,
    private onec: OneCAdapter,
    private uzasbo: UzAsboAdapter,
    private bitrix: BitrixAdapter,
  ) {}

  findAll(tenantId: string) {
    return this.prisma.integration.findMany({
      where: { tenantId },
      include: {
        logs: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });
  }

  async findOne(tenantId: string, id: string) {
    const item = await this.prisma.integration.findFirst({ where: { id, tenantId } });
    if (!item) throw new NotFoundException('Integration not found');
    return item;
  }

  async create(tenantId: string, dto: CreateIntegrationDto) {
    const existing = await this.prisma.integration.findUnique({
      where: { tenantId_type: { tenantId, type: dto.type } },
    });
    if (existing) throw new BadRequestException(`${dto.type} integration already exists`);
    return this.prisma.integration.create({
      data: { tenantId, type: dto.type, name: dto.name, config: dto.config },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateIntegrationDto) {
    await this.findOne(tenantId, id);
    return this.prisma.integration.update({ where: { id }, data: dto });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.integration.delete({ where: { id } });
  }

  async testConnection(tenantId: string, id: string): Promise<{ ok: boolean }> {
    const integration = await this.findOne(tenantId, id);
    const config = integration.config as any;
    let ok = false;
    if (integration.type === IntegrationType.ONEC) ok = await this.onec.testConnection(config);
    else if (integration.type === IntegrationType.UZASBO) ok = await this.uzasbo.testConnection(config);
    else if (integration.type === IntegrationType.BITRIX24) ok = await this.bitrix.testConnection(config);
    return { ok };
  }

  async sync(tenantId: string, id: string, syncType: string) {
    const integration = await this.findOne(tenantId, id);
    const startedAt = new Date();
    await this.prisma.integration.update({
      where: { id },
      data: { syncStatus: IntegrationSyncStatus.RUNNING },
    });

    let synced = 0;
    let failed = 0;
    let errorMessage: string | null = null;
    const config = integration.config as any;

    try {
      let result = { synced: 0, failed: 0, errors: [] as string[] };

      if (integration.type === IntegrationType.ONEC) {
        result = syncType === 'PAYROLL'
          ? await this.onec.syncPayroll(config)
          : await this.onec.syncEmployees(config);
      } else if (integration.type === IntegrationType.UZASBO) {
        result = await this.uzasbo.syncEmployees(config);
      } else if (integration.type === IntegrationType.BITRIX24) {
        result = await this.bitrix.syncUsers(config);
      }

      synced = result.synced;
      failed = result.failed;
      if (result.errors.length) errorMessage = result.errors.join('; ');
    } catch (e) {
      failed = 1;
      errorMessage = e.message;
    }

    const status = errorMessage ? 'FAILED' : 'SUCCESS';
    const completedAt = new Date();

    const [log] = await this.prisma.$transaction([
      this.prisma.integrationLog.create({
        data: {
          integrationId: id,
          tenantId,
          syncType,
          status,
          recordsSynced: synced,
          recordsFailed: failed,
          errorMessage,
          startedAt,
          completedAt,
        },
      }),
      this.prisma.integration.update({
        where: { id },
        data: {
          syncStatus: status === 'SUCCESS' ? IntegrationSyncStatus.SUCCESS : IntegrationSyncStatus.FAILED,
          lastSyncAt: completedAt,
        },
      }),
    ]);

    return log;
  }

  getLogs(tenantId: string, integrationId: string) {
    return this.prisma.integrationLog.findMany({
      where: { integrationId, tenantId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
