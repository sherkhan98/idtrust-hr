import { Injectable, Inject, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  private async safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
    try {
      return await fn();
    } catch {
      return fallback;
    }
  }

  async get(key: string): Promise<string | null> {
    return this.safe(() => this.redis.get(key), null);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    await this.safe(async () => {
      if (ttlSeconds) await this.redis.setex(key, ttlSeconds, value);
      else await this.redis.set(key, value);
    }, undefined);
  }

  async del(key: string): Promise<void> {
    await this.safe(() => this.redis.del(key), undefined);
  }

  async delPattern(pattern: string): Promise<void> {
    await this.safe(async () => {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) await this.redis.del(...keys);
    }, undefined);
  }

  async getJson<T>(key: string): Promise<T | null> {
    const data = await this.get(key);
    if (!data) return null;
    try { return JSON.parse(data) as T; } catch { return null; }
  }

  async setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttlSeconds);
  }

  async incr(key: string): Promise<number> {
    return this.safe(() => this.redis.incr(key), 0);
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    await this.safe(() => this.redis.expire(key, ttlSeconds), undefined);
  }

  async exists(key: string): Promise<boolean> {
    return this.safe(async () => (await this.redis.exists(key)) > 0, false);
  }

  async hset(key: string, field: string, value: string): Promise<void> {
    await this.safe(() => this.redis.hset(key, field, value), undefined);
  }

  async hget(key: string, field: string): Promise<string | null> {
    return this.safe(() => this.redis.hget(key, field), null);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    return this.safe(() => this.redis.hgetall(key), {});
  }
}
