import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

export type CurrencyCode = 'UZS' | 'USD' | 'EUR' | 'RUB' | 'GBP' | 'CNY';

interface ExchangeRate {
  from: CurrencyCode;
  to: CurrencyCode;
  rate: number;
  updatedAt: Date;
  source: 'CBU' | 'MANUAL';
}

@Injectable()
export class MultiCurrencyService {
  // Central Bank of Uzbekistan rates (mock — real: https://cbu.uz/uz/arkhiv-kursov-valyut/)
  private rates: Record<CurrencyCode, number> = {
    UZS: 1,
    USD: 12750,
    EUR: 13890,
    RUB: 140,
    GBP: 16200,
    CNY: 1760,
  };

  constructor(private prisma: PrismaService) {}

  async getRates(tenantId: string): Promise<ExchangeRate[]> {
    const currencies: CurrencyCode[] = ['USD', 'EUR', 'RUB', 'GBP'];
    return currencies.map((cur) => ({
      from: cur,
      to: 'UZS',
      rate: this.rates[cur],
      updatedAt: new Date(),
      source: 'CBU',
    }));
  }

  async refreshRatesFromCBU(): Promise<Record<CurrencyCode, number>> {
    // In production: fetch from https://cbu.uz/uz/arkhiv-kursov-valyut/json/
    // Mock response
    this.rates = {
      UZS: 1,
      USD: 12750 + Math.floor(Math.random() * 50 - 25),
      EUR: 13890 + Math.floor(Math.random() * 60 - 30),
      RUB: 140 + Math.floor(Math.random() * 4 - 2),
      GBP: 16200 + Math.floor(Math.random() * 80 - 40),
      CNY: 1760 + Math.floor(Math.random() * 20 - 10),
    };
    return this.rates;
  }

  convert(amount: number, from: CurrencyCode, to: CurrencyCode): number {
    const amountInUzs = amount * this.rates[from];
    return Math.round(amountInUzs / this.rates[to]);
  }

  formatAmount(amount: number, currency: CurrencyCode): string {
    const symbols: Record<CurrencyCode, string> = {
      UZS: "so'm", USD: '$', EUR: '€', RUB: '₽', GBP: '£', CNY: '¥',
    };
    if (currency === 'UZS') {
      return `${amount.toLocaleString('uz-UZ')} ${symbols.UZS}`;
    }
    return `${symbols[currency]}${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }

  async calculatePayroll(tenantId: string, periodId: string) {
    const employees = await this.prisma.employee.findMany({
      where: { tenantId, status: 'ACTIVE' },
    });

    const results = employees.map((emp) => {
      const salary = emp.baseSalary ? { amount: Number(emp.baseSalary), currency: 'UZS' } : null;
      if (!salary) return null;

      const currency = (salary.currency as CurrencyCode) || 'UZS';
      const grossAmount = salary.amount;
      const grossUzs = this.convert(grossAmount, currency, 'UZS');
      const taxUzs = Math.round(grossUzs * 0.12); // 12% JSHIR
      const netUzs = grossUzs - taxUzs;

      return {
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        currency,
        grossAmount,
        grossUzs,
        taxUzs,
        netUzs,
        netAmount: this.convert(netUzs, 'UZS', currency),
      };
    }).filter(Boolean);

    const totalUzs = results.reduce((sum, r) => sum + (r?.netUzs || 0), 0);

    return {
      employees: results,
      totals: {
        UZS: totalUzs,
        USD: this.convert(totalUzs, 'UZS', 'USD'),
        EUR: this.convert(totalUzs, 'UZS', 'EUR'),
      },
    };
  }
}
