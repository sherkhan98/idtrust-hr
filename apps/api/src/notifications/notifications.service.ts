import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotificationType, NotifChannel } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    tenantId: string;
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    channel?: NotifChannel;
    extraData?: any;
  }) {
    return this.prisma.notification.create({
      data: {
        tenantId: data.tenantId,
        userId: data.userId,
        type: data.type,
        title: data.title,
        body: data.body,
        channel: data.channel || 'IN_APP',
        data: data.extraData,
      },
    });
  }

  async getUserNotifications(userId: string, page = 1, limit = 20) {
    const [total, notifications] = await Promise.all([
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const unreadCount = await this.prisma.notification.count({
      where: { userId, readAt: null },
    });

    return { data: notifications, total, unreadCount };
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { readAt: new Date() },
    });
  }

  async markAllRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
  }
}
