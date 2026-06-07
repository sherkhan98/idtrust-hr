import { Injectable, Logger } from '@nestjs/common';

export interface TelegramConfig { botToken: string; chatId: string }
export interface EmailConfig { host: string; port: number; user: string; pass: string; from: string }
export interface SmsConfig { provider: string; apiKey: string; senderId: string }

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async sendTelegram(config: TelegramConfig, message: string): Promise<boolean> {
    try {
      const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: config.chatId, text: message, parse_mode: 'HTML' }),
        signal: AbortSignal.timeout(5000),
      });
      const data = await res.json() as any;
      if (!data.ok) throw new Error(data.description || 'Telegram error');
      return true;
    } catch (e) {
      this.logger.warn(`Telegram send failed: ${e.message}`);
      return false;
    }
  }

  async sendEmail(config: EmailConfig, to: string, subject: string, html: string): Promise<boolean> {
    // In production use nodemailer — this is a placeholder
    try {
      this.logger.log(`Email to ${to}: ${subject}`);
      return true;
    } catch (e) {
      this.logger.warn(`Email send failed: ${e.message}`);
      return false;
    }
  }

  async sendSms(config: SmsConfig, to: string, text: string): Promise<boolean> {
    try {
      if (config.provider === 'eskiz') {
        const res = await fetch('https://notify.eskiz.uz/api/message/sms/send', {
          method: 'POST',
          headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobile_phone: to.replace('+', ''), message: text, from: config.senderId }),
        });
        const data = await res.json() as any;
        return data.status === 'waiting';
      }
      this.logger.log(`SMS to ${to}: ${text}`);
      return true;
    } catch (e) {
      this.logger.warn(`SMS send failed: ${e.message}`);
      return false;
    }
  }

  buildTelegramMessage(template: string, vars: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] || '');
  }
}
