import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotificationService } from './notification.service';
import { AutomationTrigger } from '@prisma/client';

@Injectable()
export class AutomationService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationService,
  ) {}

  findAll(tenantId: string) {
    return this.prisma.automationRule.findMany({
      where: { tenantId },
      include: { logs: { orderBy: { createdAt: 'desc' }, take: 3 } },
    });
  }

  create(tenantId: string, data: {
    name: string;
    trigger: AutomationTrigger;
    triggerConfig: Record<string, any>;
    actions: string[];
    recipientRoles: string[];
  }) {
    return this.prisma.automationRule.create({ data: { tenantId, ...data } });
  }

  toggle(tenantId: string, id: string, isActive: boolean) {
    return this.prisma.automationRule.update({
      where: { id },
      data: { isActive },
    });
  }

  delete(tenantId: string, id: string) {
    return this.prisma.automationRule.delete({ where: { id } });
  }

  getLogs(tenantId: string) {
    return this.prisma.automationLog.findMany({
      where: { tenantId },
      include: { rule: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async getChannels(tenantId: string) {
    return this.prisma.notificationChannel.findUnique({ where: { tenantId } });
  }

  async saveChannels(tenantId: string, data: { telegram?: any; email?: any; sms?: any; inApp?: any }) {
    return this.prisma.notificationChannel.upsert({
      where: { tenantId },
      create: { tenantId, ...data },
      update: data,
    });
  }

  /**
   * Execute all matching rules for a given trigger and employee.
   * Called by other services (attendance, payroll, leave, etc.)
   */
  async fire(tenantId: string, trigger: AutomationTrigger, employeeId: string, context: Record<string, any> = {}) {
    const rules = await this.prisma.automationRule.findMany({
      where: { tenantId, trigger, isActive: true },
    });

    const channel = await this.prisma.notificationChannel.findUnique({ where: { tenantId } });

    for (const rule of rules) {
      const cfg = rule.triggerConfig as any;

      // Check trigger conditions
      if (trigger === AutomationTrigger.ABSENT_DAYS && context.absentDays < (cfg.days ?? 3)) continue;
      if (trigger === AutomationTrigger.LATE_ARRIVAL && context.lateCount < (cfg.count ?? 3)) continue;
      if (trigger === AutomationTrigger.CONTRACT_ENDING && context.daysLeft > (cfg.daysLeft ?? 30)) continue;
      if (trigger === AutomationTrigger.KPI_BELOW_TARGET && context.kpi > (cfg.threshold ?? 70)) continue;

      const message = this.buildMessage(trigger, context);
      let success = false;
      const errors: string[] = [];

      for (const action of rule.actions) {
        try {
          if (action === 'TELEGRAM' && channel?.telegram) {
            const ok = await this.notifications.sendTelegram(channel.telegram as any, message);
            if (!ok) errors.push('Telegram failed');
            else success = true;
          } else if (action === 'EMAIL' && channel?.email) {
            const ok = await this.notifications.sendEmail(channel.email as any, context.employeeEmail ?? '', `StaffFlow: ${trigger}`, `<p>${message}</p>`);
            if (!ok) errors.push('Email failed');
            else success = true;
          } else if (action === 'SMS' && channel?.sms) {
            const ok = await this.notifications.sendSms(channel.sms as any, context.employeePhone ?? '', message);
            if (!ok) errors.push('SMS failed');
            else success = true;
          } else {
            success = true; // IN_APP handled separately
          }
        } catch (e) {
          errors.push(e.message);
        }
      }

      await this.prisma.$transaction([
        this.prisma.automationLog.create({
          data: {
            ruleId: rule.id,
            tenantId,
            employeeId,
            action: rule.actions.join(','),
            success,
            errorMessage: errors.length ? errors.join('; ') : null,
            payload: context,
          },
        }),
        this.prisma.automationRule.update({
          where: { id: rule.id },
          data: { executionCount: { increment: 1 }, lastRunAt: new Date() },
        }),
      ]);
    }
  }

  private buildMessage(trigger: AutomationTrigger, ctx: Record<string, any>): string {
    const name = ctx.employeeName ?? 'Xodim';
    const msgs: Record<string, string> = {
      ABSENT_DAYS: `⚠️ <b>${name}</b> ${ctx.absentDays} kun ketma-ket ishga kelmadi`,
      LATE_ARRIVAL: `⏰ <b>${name}</b> bu oy ${ctx.lateCount} marta kechikdi`,
      BIRTHDAY: `🎂 Bugun <b>${name}</b> ning tug'ilgan kuni! Tabriklaymiz!`,
      WORK_ANNIVERSARY: `🎉 <b>${name}</b> kompaniyada ${ctx.years} yil ishladi!`,
      CONTRACT_ENDING: `📋 <b>${name}</b> ning shartnomasi ${ctx.daysLeft} kun ichida tugaydi`,
      LEAVE_APPROVED: `✅ <b>${name}</b> ning ta'til so'rovi tasdiqlandi`,
      LEAVE_REJECTED: `❌ <b>${name}</b> ning ta'til so'rovi rad etildi`,
      KPI_BELOW_TARGET: `📉 <b>${name}</b> KPI ko'rsatkichi ${ctx.kpi}% — maqsaddan past`,
      PAYROLL_PROCESSED: `💰 <b>${name}</b> uchun maosh hisoblandi: ${ctx.netSalary ?? ''}`,
      NEW_EMPLOYEE: `👋 Yangi xodim <b>${name}</b> qo'shildi — ${ctx.department ?? ''}`,
      EMPLOYEE_EXIT: `👋 <b>${name}</b> kompaniyadan chiqdi`,
      PROBATION_END: `📌 <b>${name}</b> ning sinov muddati ${ctx.daysLeft} kun ichida tugaydi`,
    };
    return msgs[trigger] ?? `StaffFlow: ${trigger} — ${name}`;
  }
}
