import { Injectable, Logger } from '@nestjs/common';

export interface BitrixConfig {
  webhookUrl: string; // https://domain.bitrix24.com/rest/1/XXXXXXXX/
}

@Injectable()
export class BitrixAdapter {
  private readonly logger = new Logger(BitrixAdapter.name);

  private call(config: BitrixConfig, method: string, params: Record<string, any> = {}): Promise<any> {
    const url = `${config.webhookUrl.replace(/\/$/, '')}/${method}.json`;
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: AbortSignal.timeout(8000),
    }).then((r) => r.json());
  }

  async testConnection(config: BitrixConfig): Promise<boolean> {
    try {
      const result = await this.call(config, 'app.info');
      return !result.error;
    } catch (e) {
      this.logger.warn(`Bitrix24 connection test failed: ${e.message}`);
      return false;
    }
  }

  async syncUsers(config: BitrixConfig): Promise<{ synced: number; failed: number; errors: string[] }> {
    const errors: string[] = [];
    try {
      const result = await this.call(config, 'user.get', { FILTER: { ACTIVE: true } });
      if (result.error) throw new Error(result.error_description || result.error);
      const users: any[] = result.result || [];
      return { synced: users.length, failed: 0, errors };
    } catch (e) {
      errors.push(e.message);
      return { synced: 0, failed: 1, errors };
    }
  }

  async createEmployee(config: BitrixConfig, employee: {
    name: string; lastName: string; email: string; phone?: string; departmentId?: number;
  }): Promise<{ id: string | null; error?: string }> {
    try {
      const result = await this.call(config, 'user.add', {
        NAME: employee.name,
        LAST_NAME: employee.lastName,
        EMAIL: employee.email,
        PERSONAL_PHONE: employee.phone,
        UF_DEPARTMENT: employee.departmentId ? [employee.departmentId] : undefined,
        ACTIVE: true,
      });
      if (result.error) throw new Error(result.error_description || result.error);
      return { id: String(result.result) };
    } catch (e) {
      return { id: null, error: e.message };
    }
  }
}
