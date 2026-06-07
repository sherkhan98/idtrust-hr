import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class EsignatureService {
  constructor(private prisma: PrismaService) {}

  async getDocuments(tenantId: string, filters?: { status?: string; page?: number }) {
    const { page = 1, status } = filters || {};
    return this.prisma.esignDocument.findMany({
      where: {
        tenantId,
        ...(status && { status }),
      },
      include: {
        signatories: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
          },
        },
        createdBy: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * 20,
      take: 20,
    });
  }

  async createDocument(tenantId: string, userId: string, data: {
    title: string;
    type: string;
    content: string;
    signatoryIds: string[];
    dueDate?: Date;
  }) {
    const doc = await this.prisma.esignDocument.create({
      data: {
        tenantId,
        createdById: userId,
        title: data.title,
        type: data.type,
        content: data.content,
        status: 'PENDING',
        dueDate: data.dueDate,
        documentHash: crypto.createHash('sha256').update(data.content).digest('hex'),
        signatories: {
          create: data.signatoryIds.map((uid, order) => ({
            userId: uid,
            order,
            status: 'PENDING',
          })),
        },
      },
      include: { signatories: true },
    });
    return doc;
  }

  async signDocument(tenantId: string, docId: string, userId: string, data: {
    signatureData: string;
    otpCode?: string;
    ipAddress: string;
    userAgent: string;
  }) {
    const doc = await this.prisma.esignDocument.findFirst({
      where: { id: docId, tenantId },
      include: { signatories: true },
    });

    if (!doc) throw new NotFoundException('Document not found');

    const signatory = doc.signatories.find((s) => s.userId === userId);
    if (!signatory) throw new BadRequestException('You are not a signatory');
    if (signatory.status === 'SIGNED') throw new BadRequestException('Already signed');

    const signatureHash = crypto
      .createHash('sha256')
      .update(`${doc.documentHash}:${userId}:${Date.now()}`)
      .digest('hex');

    await this.prisma.esignSignatory.update({
      where: { id: signatory.id },
      data: {
        status: 'SIGNED',
        signedAt: new Date(),
        signatureData: data.signatureData,
        signatureHash,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      } as any,
    });

    // Check if all signed
    const allSigned = doc.signatories.every(
      (s) => s.id === signatory.id || s.status === 'SIGNED',
    );

    if (allSigned) {
      await this.prisma.esignDocument.update({
        where: { id: docId },
        data: { status: 'SIGNED', completedAt: new Date() } as any,
      });
    }

    return { signed: true, allSigned, signatureHash };
  }

  async getAuditTrail(tenantId: string, docId: string) {
    return this.prisma.esignDocument.findFirst({
      where: { id: docId, tenantId },
      include: {
        signatories: {
          include: { user: { select: { firstName: true, lastName: true, email: true } } },
          orderBy: { order: 'asc' },
        },
        createdBy: { select: { firstName: true, lastName: true, email: true } },
      },
    });
  }

  async getTemplates(tenantId: string) {
    return this.prisma.esignTemplate.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createFromTemplate(tenantId: string, userId: string, templateId: string, variables: Record<string, string>) {
    const template = await this.prisma.esignTemplate.findFirst({
      where: { id: templateId, tenantId },
    });
    if (!template) throw new NotFoundException('Template not found');

    let content = template.content as string;
    Object.entries(variables).forEach(([k, v]) => {
      content = content.replace(new RegExp(`{{${k}}}`, 'g'), v);
    });

    return this.createDocument(tenantId, userId, {
      title: `${template.name} — ${new Date().toLocaleDateString('uz-UZ')}`,
      type: template.type as string,
      content,
      signatoryIds: [],
    });
  }
}
