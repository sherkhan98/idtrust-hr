import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import axios from 'axios';

// Each school has its own Telegram bot token configured by director
// Director goes to /school/settings → enters their bot token → parents subscribe

export interface SchoolBotConfig {
  schoolId: string;
  botToken: string;
  botUsername: string;
  showGrades: boolean;      // Director toggle: ota-onalar baholarni ko'ra oladimi
  showAttendance: boolean;  // Always true by default
  showPhoto: boolean;       // Send arrival/departure photo
  dailySummaryTime: string; // e.g. "17:00" - kunlik hisobot vaqti
  language: 'uz' | 'ru';
}

interface TelegramUpdate {
  update_id: number;
  message?: {
    chat: { id: number; type: string };
    from: { id: number; first_name: string; last_name?: string; username?: string };
    text?: string;
    contact?: { phone_number: string };
  };
  callback_query?: {
    id: string;
    from: { id: number };
    data: string;
    message: { chat: { id: number }; message_id: number };
  };
}

@Injectable()
export class SchoolBotService implements OnModuleInit {
  private readonly logger = new Logger(SchoolBotService.name);
  private bots = new Map<string, SchoolBotConfig>();

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async onModuleInit() {
    // Load all school bot configs from DB
    await this.loadBotConfigs();
  }

  async loadBotConfigs() {
    const schools = await this.prisma.school.findMany({
      where: { settings: { not: undefined } },
    });

    for (const school of schools) {
      const settings = school.settings as any;
      if (settings?.telegramBotToken) {
        this.bots.set(school.id, {
          schoolId: school.id,
          botToken: settings.telegramBotToken,
          botUsername: settings.botUsername || '',
          showGrades: settings.showGrades ?? false,
          showAttendance: settings.showAttendance ?? true,
          showPhoto: settings.showPhoto ?? true,
          dailySummaryTime: settings.dailySummaryTime || '17:00',
          language: settings.language || 'uz',
        });
      }
    }
    this.logger.log(`Loaded ${this.bots.size} school bot(s)`);
  }

  async saveBotConfig(schoolId: string, config: Partial<SchoolBotConfig>): Promise<boolean> {
    try {
      // Test token first
      if (config.botToken) {
        const valid = await this.testBotToken(config.botToken);
        if (!valid) return false;
      }

      const school = await this.prisma.school.findUnique({ where: { id: schoolId } });
      if (!school) return false;

      const current = (school.settings as any) || {};
      await this.prisma.school.update({
        where: { id: schoolId },
        data: {
          settings: {
            ...current,
            telegramBotToken: config.botToken || current.telegramBotToken,
            botUsername: config.botUsername || current.botUsername,
            showGrades: config.showGrades ?? current.showGrades ?? false,
            showAttendance: config.showAttendance ?? current.showAttendance ?? true,
            showPhoto: config.showPhoto ?? current.showPhoto ?? true,
            dailySummaryTime: config.dailySummaryTime || current.dailySummaryTime || '17:00',
            language: config.language || current.language || 'uz',
          },
        },
      });

      await this.loadBotConfigs(); // Reload
      return true;
    } catch (err: any) {
      this.logger.error(`Failed to save bot config: ${err.message}`);
      return false;
    }
  }

  async testBotToken(token: string): Promise<{ valid: boolean; username?: string; name?: string }> {
    try {
      const res = await axios.get(`https://api.telegram.org/bot${token}/getMe`, { timeout: 5000 });
      return {
        valid: true,
        username: res.data.result.username,
        name: res.data.result.first_name,
      };
    } catch {
      return { valid: false };
    }
  }

  // Called when student arrives/departs (from school attendance service)
  async notifyParentArrival(params: {
    schoolId: string;
    studentId: string;
    eventType: 'ARRIVAL' | 'DEPARTURE';
    timestamp: Date;
    photoUrl?: string;
    confidence?: number;
  }) {
    const bot = this.bots.get(params.schoolId);
    if (!bot) return;

    const student = await this.prisma.schoolStudent.findUnique({
      where: { id: params.studentId },
      include: {
        parents: true,
        class: { include: { school: true } },
      },
    });
    if (!student) return;

    const time = params.timestamp.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    const date = params.timestamp.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' });
    const isArrival = params.eventType === 'ARRIVAL';
    const emoji = isArrival ? '✅' : '🏠';
    const statusText = isArrival ? 'Maktabga keldi' : 'Maktabdan ketdi';

    for (const parent of student.parents) {
      if (!parent.telegramChatId || !parent.receivesTelegram) continue;

      const caption = [
        `${emoji} <b>${student.firstName} ${student.lastName}</b>`,
        ``,
        `📚 Maktab: ${student.class.school.name}`,
        `🏫 Sinf: ${student.class.name}`,
        `📋 Holat: <b>${statusText}</b>`,
        `🕐 Vaqt: <b>${time}</b>`,
        `📅 Sana: ${date}`,
        params.confidence ? `🤖 Ishonchlilik: ${params.confidence.toFixed(1)}%` : '',
      ].filter(Boolean).join('\n');

      try {
        if (params.photoUrl && bot.showPhoto) {
          await axios.post(`https://api.telegram.org/bot${bot.botToken}/sendPhoto`, {
            chat_id: parent.telegramChatId,
            photo: params.photoUrl,
            caption,
            parse_mode: 'HTML',
          });
        } else {
          await axios.post(`https://api.telegram.org/bot${bot.botToken}/sendMessage`, {
            chat_id: parent.telegramChatId,
            text: caption,
            parse_mode: 'HTML',
          });
        }
      } catch (err: any) {
        this.logger.error(`Failed to notify parent ${parent.telegramChatId}: ${err.message}`);
      }
    }
  }

  // Show grades to parent (if director enabled)
  async sendGradesToParent(schoolId: string, chatId: string, studentId: string) {
    const bot = this.bots.get(schoolId);
    if (!bot || !bot.showGrades) {
      await this.sendMessage(bot!.botToken, chatId, '❌ Baholarni ko\'rish direktori tomonidan o\'chirilgan.');
      return;
    }

    const grades = await this.prisma.journalGrade.findMany({
      where: { studentId },
      include: { journal: { select: { subject: true } } },
      orderBy: { date: 'desc' },
      take: 20,
    });

    if (!grades.length) {
      await this.sendMessage(bot.botToken, chatId, 'ℹ️ Hozircha baholar yo\'q.');
      return;
    }

    // Group by subject
    const bySubject = grades.reduce((acc, g) => {
      const subj = g.journal.subject;
      if (!acc[subj]) acc[subj] = [];
      if (g.grade) acc[subj].push(g.grade);
      return acc;
    }, {} as Record<string, number[]>);

    const lines = Object.entries(bySubject).map(([subj, vals]) => {
      const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
      const emoji = Number(avg) >= 4.5 ? '🟢' : Number(avg) >= 3.5 ? '🟡' : '🔴';
      return `${emoji} ${subj}: <b>${avg}</b> (${vals.join(', ')})`;
    });

    const text = `📊 <b>Baholar</b>\n\n${lines.join('\n')}\n\n<i>So'nggi 20 ta baholash natijasi</i>`;
    await this.sendMessage(bot.botToken, chatId, text);
  }

  // Send attendance summary to parent
  async sendAttendanceSummary(schoolId: string, chatId: string, studentId: string) {
    const bot = this.bots.get(schoolId);
    if (!bot) return;

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const records = await this.prisma.schoolAttendance.findMany({
      where: { studentId, date: { gte: thisMonth } },
      orderBy: { date: 'desc' },
    });

    const present = records.filter(r => r.status === 'PRESENT').length;
    const absent = records.filter(r => r.status === 'ABSENT').length;
    const total = records.length;
    const pct = total > 0 ? Math.round((present / total) * 100) : 0;

    const text = [
      `📋 <b>Bu oy davomati</b>`,
      ``,
      `✅ Keldi: <b>${present} kun</b>`,
      `❌ Kelmadi: <b>${absent} kun</b>`,
      `📊 Foiz: <b>${pct}%</b>`,
      ``,
      records.length > 0 ? `<i>Oxirgi kelish: ${records[0].arrivalTime?.toLocaleTimeString('uz-UZ', {hour:'2-digit',minute:'2-digit'}) || '—'}</i>` : '',
    ].filter(Boolean).join('\n');

    await this.sendMessage(bot.botToken, chatId, text);
  }

  // Handle incoming Telegram updates (webhook)
  async handleWebhook(schoolId: string, update: TelegramUpdate) {
    const bot = this.bots.get(schoolId);
    if (!bot) return;

    if (update.message?.text) {
      const chatId = String(update.message.chat.id);
      const text = update.message.text.toLowerCase().trim();

      if (text === '/start') {
        await this.handleStart(bot, chatId, update.message.from);
      } else if (text === '/davomat' || text === 'davomat') {
        // Find student linked to this parent
        const parent = await this.prisma.schoolParent.findFirst({
          where: { telegramChatId: chatId },
          include: { student: true },
        });
        if (parent) {
          await this.sendAttendanceSummary(schoolId, chatId, parent.studentId);
        } else {
          await this.sendMessage(bot.botToken, chatId, '❗ Avval ro\'yxatdan o\'ting: /start');
        }
      } else if (text === '/baholar' || text === 'baholar') {
        const parent = await this.prisma.schoolParent.findFirst({
          where: { telegramChatId: chatId },
        });
        if (parent) {
          await this.sendGradesToParent(schoolId, chatId, parent.studentId);
        }
      } else if (text === '/yordam' || text === '/help') {
        await this.sendHelp(bot, chatId);
      } else {
        await this.sendMessage(bot.botToken, chatId, '❓ Buyruqlarni ko\'rish uchun /yordam yozing');
      }
    }

    if (update.callback_query) {
      await this.handleCallbackQuery(bot, update.callback_query);
    }
  }

  private async handleStart(bot: SchoolBotConfig, chatId: string, from: any) {
    const school = await this.prisma.school.findUnique({ where: { id: bot.schoolId } });
    const text = [
      `🏫 <b>${school?.name || 'Maktab'} — Ota-ona bot</b>`,
      ``,
      `Assalomu alaykum, ${from.first_name}!`,
      ``,
      `Bu bot orqali farzandingizning:`,
      `✅ Kelish/ketish vaqtini kuzating`,
      bot.showAttendance ? `📋 Oylik davomat hisobotini ko'ring` : '',
      bot.showGrades ? `📊 Baholarini ko'ring` : '',
      ``,
      `📱 <b>Mavjud buyruqlar:</b>`,
      `/davomat — Bu oylik davomat`,
      bot.showGrades ? `/baholar — Baholar` : '',
      `/yordam — Yordam`,
      ``,
      `<i>Ro'yxatdan o'tish uchun telefon raqamingizni yuboring:</i>`,
    ].filter(Boolean).join('\n');

    await axios.post(`https://api.telegram.org/bot${bot.botToken}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      reply_markup: {
        keyboard: [[{ text: '📱 Telefon raqamni ulash', request_contact: true }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  }

  private async sendHelp(bot: SchoolBotConfig, chatId: string) {
    const commands = [
      '/davomat — Bu oylik davomat hisoboti',
      bot.showGrades ? '/baholar — Baholar va o\'rtacha ball' : '',
      '/start — Botni qayta ishga tushirish',
    ].filter(Boolean).join('\n');

    await this.sendMessage(bot.botToken, chatId, `📚 <b>Buyruqlar ro'yxati:</b>\n\n${commands}`);
  }

  private async handleCallbackQuery(bot: SchoolBotConfig, query: any) {
    await axios.post(`https://api.telegram.org/bot${bot.botToken}/answerCallbackQuery`, {
      callback_query_id: query.id,
    });
  }

  private async sendMessage(token: string, chatId: string, text: string) {
    try {
      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      });
    } catch (err: any) {
      this.logger.error(`sendMessage failed: ${err.message}`);
    }
  }

  // Set webhook for a school's bot
  async setWebhook(schoolId: string, webhookBaseUrl: string): Promise<boolean> {
    const bot = this.bots.get(schoolId);
    if (!bot) return false;

    const webhookUrl = `${webhookBaseUrl}/api/v1/telegram-bot/webhook/${schoolId}`;
    try {
      await axios.post(`https://api.telegram.org/bot${bot.botToken}/setWebhook`, {
        url: webhookUrl,
        allowed_updates: ['message', 'callback_query'],
      });
      this.logger.log(`Webhook set for school ${schoolId}: ${webhookUrl}`);
      return true;
    } catch (err: any) {
      this.logger.error(`Failed to set webhook: ${err.message}`);
      return false;
    }
  }

  getBotConfig(schoolId: string): SchoolBotConfig | undefined {
    return this.bots.get(schoolId);
  }

  getAllBots() {
    return Array.from(this.bots.values()).map(b => ({
      schoolId: b.schoolId,
      botUsername: b.botUsername,
      showGrades: b.showGrades,
      showAttendance: b.showAttendance,
    }));
  }
}
