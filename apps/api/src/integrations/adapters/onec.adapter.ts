import { Injectable, Logger } from '@nestjs/common';

export interface OneCConfig {
  baseUrl: string;
  username: string;
  password: string;
  infoBase: string;
}

@Injectable()
export class OneCAdapter {
  private readonly logger = new Logger(OneCAdapter.name);

  async testConnection(config: OneCConfig): Promise<boolean> {
    try {
      const url = `${config.baseUrl}/hs/staffflow/v1/ping`;
      const auth = Buffer.from(`${config.username}:${config.password}`).toString('base64');
      const res = await fetch(url, {
        headers: { Authorization: `Basic ${auth}` },
        signal: AbortSignal.timeout(5000),
      });
      return res.ok;
    } catch (e) {
      this.logger.warn(`1C connection test failed: ${e.message}`);
      return false;
    }
  }

  async syncEmployees(config: OneCConfig): Promise<{ synced: number; failed: number; errors: string[] }> {
    const errors: string[] = [];
    try {
      const url = `${config.baseUrl}/hs/staffflow/v1/employees`;
      const auth = Buffer.from(`${config.username}:${config.password}`).toString('base64');
      const res = await fetch(url, { headers: { Authorization: `Basic ${auth}` } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: any[] = await res.json();
      return { synced: data.length, failed: 0, errors };
    } catch (e) {
      errors.push(e.message);
      return { synced: 0, failed: 1, errors };
    }
  }

  async syncPayroll(config: OneCConfig): Promise<{ synced: number; failed: number; errors: string[] }> {
    const errors: string[] = [];
    try {
      const url = `${config.baseUrl}/hs/staffflow/v1/payroll`;
      const auth = Buffer.from(`${config.username}:${config.password}`).toString('base64');
      const res = await fetch(url, { headers: { Authorization: `Basic ${auth}` } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: any[] = await res.json();
      return { synced: data.length, failed: 0, errors };
    } catch (e) {
      errors.push(e.message);
      return { synced: 0, failed: 1, errors };
    }
  }
}
