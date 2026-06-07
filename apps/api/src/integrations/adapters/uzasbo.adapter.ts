import { Injectable, Logger } from '@nestjs/common';

export interface UzAsboConfig {
  apiUrl: string;
  apiKey: string;
  tin: string; // INN — taxpayer identification number
}

@Injectable()
export class UzAsboAdapter {
  private readonly logger = new Logger(UzAsboAdapter.name);

  async testConnection(config: UzAsboConfig): Promise<boolean> {
    try {
      const res = await fetch(`${config.apiUrl}/api/v1/ping`, {
        headers: { 'X-Api-Key': config.apiKey, 'X-TIN': config.tin },
        signal: AbortSignal.timeout(5000),
      });
      return res.ok;
    } catch (e) {
      this.logger.warn(`UzASBO connection test failed: ${e.message}`);
      return false;
    }
  }

  async syncEmployees(config: UzAsboConfig): Promise<{ synced: number; failed: number; errors: string[] }> {
    const errors: string[] = [];
    try {
      const res = await fetch(`${config.apiUrl}/api/v1/employees`, {
        headers: { 'X-Api-Key': config.apiKey, 'X-TIN': config.tin },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: any[] = await res.json();
      return { synced: data.length, failed: 0, errors };
    } catch (e) {
      errors.push(e.message);
      return { synced: 0, failed: 1, errors };
    }
  }

  async exportPayroll(config: UzAsboConfig, payload: any): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${config.apiUrl}/api/v1/payroll`, {
        method: 'POST',
        headers: { 'X-Api-Key': config.apiKey, 'X-TIN': config.tin, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}
