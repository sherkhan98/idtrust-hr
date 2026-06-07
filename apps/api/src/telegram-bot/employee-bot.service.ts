import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import axios from 'axios';

// Employee Telegram Bot — Mini App integration
// Each tenant has its own bot token + Mini App URL
// Commands: /start, /app, /davomat, /tatil, /maosh

@Injectable()
export class EmployeeBotService implements OnModuleInit {
  private readonly logger = new Logger(EmployeeBotService.name);

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async onModuleInit() {
    // Load all configured employee bots and set up webhooks
    this.logger.log('Employee bot service initialized');
  }

  // Called by webhook endpoint
  async handleUpdate(tenantId: string, update: any) {
    const bot = await this.getBotConfig(tenantId);
    if (!bot?.token) return;

    const msg = update.message;
    if (!msg?.text) return;

    const chatId = String(msg.chat.id);
    const text = (msg.text || '').trim().toLowerCase();
    const appUrl: string = bot.miniAppUrl || (this.config.get<string>('NEXT_PUBLIC_URL') ?? 'http://localhost:3000');

    const token = bot.token;
    if (!token) return;

    if (text === '/start' || text === 'start') {
      await this.sendWelcome(token, chatId, appUrl, msg.from?.first_name || 'Xodim');
    } else if (text === '/app' || text === 'ilova') {
      await this.sendAppButton(token, chatId, appUrl);
    } else if (text === '/davomat') {
      await this.sendAppButton(token, chatId, `${appUrl}/tma?screen=attendance`);
    } else if (text === '/tatil' || text === "/ta'til") {
      await this.sendAppButton(token, chatId, `${appUrl}/tma?screen=leave`);
    } else if (text === '/maosh') {
      await this.sendAppButton(token, chatId, `${appUrl}/tma?screen=salary`);
    } else if (text === '/yordam' || text === '/help') {
      await this.sendHelp(token, chatId);
    } else {
      await this.sendMessage(token, chatId,
        '❓ Buyruqni bilmayman.\n\n/app — Ilovani ochish\n/yordam — Yordam'
      );
    }
  }

  private async sendWelcome(token: string, chatId: string, appUrl: string, firstName: string) {
    const text = `👋 <b>Salom, ${firstName}!</b>\n\n🏢 PeopleOS Xodim Portali\n\nBu bot orqali:\n✅ Kelish/ketish belgilash\n🌴 Ta'til so'rash\n💰 Maosh ko'rish\n\nHammasi Telegram ichida — ilova yuklamasdan!`;

    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[
          {
            text: '🚀 Ilovani ochish',
            web_app: { url: `${appUrl}/tma` },
          },
        ]],
      },
    });
  }

  private async sendAppButton(token: string, chatId: string, url: string) {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: '👇 Quyidagi tugmani bosing:',
      reply_markup: {
        inline_keyboard: [[
          { text: '📱 PeopleOS ilovasini ochish', web_app: { url } },
        ]],
      },
    });
  }

  private async sendHelp(token: string, chatId: string) {
    const text = [
      '📚 <b>Buyruqlar ro\'yxati</b>',
      '',
      '/app — 📱 Mini ilovani ochish',
      '/davomat — ⏰ Davomat tarixi',
      "/tatil — 🌴 Ta'til balansi",
      '/maosh — 💰 Maosh ma\'lumoti',
      '/yordam — ❓ Yordam',
    ].join('\n');
    await this.sendMessage(token, chatId, text);
  }

  private async sendMessage(token: string, chatId: string, text: string) {
    try {
      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: chatId, text, parse_mode: 'HTML',
      });
    } catch (err: any) {
      this.logger.error(`sendMessage failed: ${err.message}`);
    }
  }

  // Send notification to employee (attendance marked, leave approved, etc.)
  async notifyEmployee(tenantId: string, telegramChatId: string, message: string, webAppUrl?: string) {
    const bot = await this.getBotConfig(tenantId);
    if (!bot?.token) return;

    const payload: any = {
      chat_id: telegramChatId,
      text: message,
      parse_mode: 'HTML',
    };

    if (webAppUrl) {
      payload.reply_markup = {
        inline_keyboard: [[
          { text: '📱 Ko\'rish', web_app: { url: webAppUrl } },
        ]],
      };
    }

    try {
      await axios.post(`https://api.telegram.org/bot${bot.token}/sendMessage`, payload);
    } catch (err: any) {
      this.logger.error(`notifyEmployee failed: ${err.message}`);
    }
  }

  // Notify about leave approval
  async notifyLeaveApproved(tenantId: string, employeeChatId: string, leaveType: string, dates: string) {
    const msg = `✅ <b>Ta'til so'rovingiz tasdiqlandi!</b>\n\n📋 Tur: ${leaveType}\n📅 Sana: ${dates}\n\nYaxshi dam oling! 🌴`;
    await this.notifyEmployee(tenantId, employeeChatId, msg);
  }

  async notifyLeaveRejected(tenantId: string, employeeChatId: string, reason?: string) {
    const msg = `❌ <b>Ta'til so'rovingiz rad etildi</b>\n\n${reason ? `📝 Sabab: ${reason}` : ''}`;
    await this.notifyEmployee(tenantId, employeeChatId, msg);
  }

  async notifyPayrollReady(tenantId: string, employeeChatId: string, month: string, netSalary: string) {
    const msg = `💰 <b>Maoshingiz hisoblandi!</b>\n\n📅 Oy: ${month}\n💵 Toza maosh: ${netSalary} so'm\n\n💳 Kartangizga o'tkaziladi.`;
    await this.notifyEmployee(tenantId, employeeChatId, msg);
  }

  async testBot(token: string): Promise<{ valid: boolean; username?: string; name?: string }> {
    try {
      const res = await axios.get(`https://api.telegram.org/bot${token}/getMe`, { timeout: 5000 });
      return { valid: true, username: res.data.result.username, name: res.data.result.first_name };
    } catch {
      return { valid: false };
    }
  }

  async setWebhook(token: string, webhookUrl: string): Promise<boolean> {
    try {
      await axios.post(`https://api.telegram.org/bot${token}/setWebhook`, {
        url: webhookUrl,
        allowed_updates: ['message', 'callback_query'],
      });
      return true;
    } catch {
      return false;
    }
  }

  private async getBotConfig(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { settings: true },
    });
    const s = (tenant?.settings as any) || {};
    return {
      token: s.employeeBotToken as string | undefined,
      miniAppUrl: s.miniAppUrl as string | undefined,
    };
  }
}
