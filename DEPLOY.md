# IDTrust — Deploy Qo'llanmasi

## 1. Supabase (Database)

1. https://supabase.com → New Project yarating
2. Settings → Database → Connection String → URI nusxalang
3. `apps/api/.env` ga qo'ying:
   - DATABASE_URL = Pooler URI (port 6543)
   - DIRECT_URL = Direct URI (port 5432)

## 2. Database Migration

```bash
cd apps/api
npx prisma migrate deploy
npx ts-node prisma/seed.ts
```

## 3. Railway (API)

1. https://railway.app → New Project → GitHub repo ulang
2. Root directory: `apps/api`
3. Environment variables qo'ying (.env.production.example dan)
4. Deploy!

## 4. Vercel (Web)

1. https://vercel.com → New Project → GitHub repo ulang
2. Root directory: `apps/web`
3. Environment variables qo'ying (.env.production.example dan)
4. Deploy!

## Demo hisoblar
- CEO: ceo@nexusgroup.uz / Admin@123456
- HR:  hr@nexusgroup.uz  / Hr@123456
