import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

interface NotifyParentParams {
  parent: {
    id: string;
    name: string;
    phone: string;
    telegramChatId?: string | null;
  };
  student: {
    firstName: string;
    lastName: string;
    photo?: string | null;
  };
  school: {
    name: string;
  };
  eventType: 'ARRIVAL' | 'DEPARTURE';
  timestamp: Date;
  photoUrl?: string;
}

@Injectable()
export class SchoolNotificationService {
  private readonly logger = new Logger(SchoolNotificationService.name);

  constructor(private config: ConfigService) {}

  async notifyParent(params: NotifyParentParams): Promise<void> {
    const { parent, student, school, eventType, timestamp, photoUrl } = params;
    const emoji = eventType === 'ARRIVAL' ? '✅' : '🏠';
    const statusText = eventType === 'ARRIVAL' ? 'Maktabga keldi' : 'Maktabdan ketdi';
    const time = timestamp.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    const date = timestamp.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });

    // Send Telegram (with photo if available)
    if (parent.telegramChatId) {
      await this.sendTelegram(parent.telegramChatId, {
        message: `${emoji} <b>${student.firstName} ${student.lastName}</b>\n\n📚 Maktab: ${school.name}\n📋 Holat: <b>${statusText}</b>\n🕐 Vaqt: ${time}\n📅 Sana: ${date}`,
        photoUrl,
      });
    }

    // Send SMS
    await this.sendSms(parent.phone, {
      message: `${emoji} ${student.firstName} ${student.lastName} — ${statusText}. Vaqt: ${time}. Maktab: ${school.name}`,
    });
  }

  async sendTelegram(chatId: string, opts: { message: string; photoUrl?: string }): Promise<void> {
    const token = this.config.get('TELEGRAM_BOT_TOKEN');
    if (!token) {
      this.logger.warn('TELEGRAM_BOT_TOKEN not configured');
      return;
    }

    try {
      if (opts.photoUrl) {
        await axios.post(`https://api.telegram.org/bot${token}/sendPhoto`, {
          chat_id: chatId,
          photo: opts.photoUrl,
          caption: opts.message,
          parse_mode: 'HTML',
        });
      } else {
        await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
          chat_id: chatId,
          text: opts.message,
          parse_mode: 'HTML',
        });
      }
    } catch (err: any) {
      this.logger.error(`Telegram notification failed: ${err.message}`);
    }
  }

  async sendSms(phone: string, opts: { message: string }): Promise<void> {
    const eskizEmail = this.config.get('ESKIZ_EMAIL');
    const eskizPassword = this.config.get('ESKIZ_PASSWORD');

    if (!eskizEmail || !eskizPassword) {
      this.logger.warn('Eskiz SMS credentials not configured');
      return;
    }

    try {
      // Get token
      const tokenRes = await axios.post('https://notify.eskiz.uz/api/auth/login', {
        email: eskizEmail, password: eskizPassword,
      });
      const token = tokenRes.data?.data?.token;
      if (!token) return;

      // Send SMS
      await axios.post('https://notify.eskiz.uz/api/message/sms/send', {
        mobile_phone: phone.replace(/\D/g, ''),
        message: opts.message,
        from: '4546',
      }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err: any) {
      this.logger.error(`SMS notification failed: ${err.message}`);
    }
  }

  async sendBulkAbsentNotification(schoolId: string, absentStudents: Array<{
    student: { firstName: string; lastName: string };
    parents: Array<{ phone: string; telegramChatId?: string | null; name: string }>;
    school: { name: string };
  }>): Promise<void> {
    for (const item of absentStudents) {
      for (const parent of item.parents) {
        const time = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
        const msg = `⚠️ ${item.student.firstName} ${item.student.lastName} bugun maktabga kelmadi. Vaqt: ${time}. Maktab: ${item.school.name}`;

        if (parent.telegramChatId) {
          await this.sendTelegram(parent.telegramChatId, { message: msg });
        }
        await this.sendSms(parent.phone, { message: msg });
      }
    }
  }
}
