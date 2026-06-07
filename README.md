# 🏢 StaffFlow HR — Enterprise HRM Platform

> O'zbekiston va Markaziy Osiyo uchun yaratilgan eng zamonaviy korporativ HR platformasi

![StaffFlow HR](https://img.shields.io/badge/StaffFlow-HR%20Platform-2563EB?style=for-the-badge&logo=data:image/svg+xml;base64,...)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

## 🎯 Features

| Module | Description |
|--------|-------------|
| 👥 Employee Management | Complete employee lifecycle |
| 🕐 Attendance | Face ID, QR, GPS, NFC, WiFi |
| 💰 Payroll | Uzbek tax rules (12% income tax) |
| 📅 Leave Management | Multi-type leave with approval |
| 🎯 KPI & Performance | Goals, scoring, analytics |
| 📋 Recruitment (ATS) | Full hiring pipeline |
| ✅ Task Management | Kanban + list view |
| 📄 Documents | e-Sign, templates |
| 📣 Social Feed | Announcements, recognition |
| 🎓 LMS | Courses, certifications |
| 🎫 Help Desk | Internal tickets |
| 📊 Analytics | CEO/HR/Manager dashboards |
| 📱 Mobile App | iOS + Android (Flutter) |
| 🔔 Notifications | Telegram, SMS, Email, Push |
| 🤖 AI Module | Attrition prediction, resume screening |
| 🏢 Multi-tenant | SaaS architecture |
| 🔐 Security | RBAC, MFA, Audit logs |

## 🛠 Tech Stack

### Frontend (apps/web)
- **Next.js 14** (App Router)
- **TypeScript** + **TailwindCSS**
- **Shadcn UI** components
- **Recharts** for analytics
- **NextAuth.js** authentication
- **React Query** for data fetching

### Backend (apps/api)
- **NestJS** framework
- **PostgreSQL** (primary database)
- **Redis** (caching, sessions)
- **Prisma ORM** (type-safe DB access)
- **JWT** authentication + **MFA** (TOTP)
- **Swagger** API documentation

### Mobile (apps/mobile)
- **Flutter** (iOS + Android)
- **Riverpod** state management
- Face recognition, GPS, QR attendance

### Infrastructure
- **Docker** + **Docker Compose**
- **Kubernetes** (production-ready)
- **Nginx** reverse proxy
- **AWS S3** file storage

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- pnpm >= 8
- PostgreSQL 16
- Redis 7
- Docker (optional)

### 1. Clone & Install

```bash
git clone https://github.com/your-org/staffflow-hr.git
cd staffflow-hr
pnpm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Database Setup

```bash
cd apps/api
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts
```

### 4. Start Development

```bash
# Start API
cd apps/api && pnpm run dev

# Start Web (in another terminal)
cd apps/web && pnpm run dev
```

### 5. Docker (Recommended)

```bash
docker-compose up -d
```

Access:
- **Web:** http://localhost:3000
- **API:** http://localhost:4000
- **Swagger:** http://localhost:4000/api/docs

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@staffflow.uz | SuperAdmin@123 |
| CEO / Admin | ceo@nexusgroup.uz | Admin@123456 |
| HR Manager | hr@nexusgroup.uz | Hr@123456 |

## 📁 Project Structure

```
staffflow-hr/
├── apps/
│   ├── api/                    # NestJS Backend
│   │   ├── src/
│   │   │   ├── auth/           # Authentication & MFA
│   │   │   ├── employees/      # Employee management
│   │   │   ├── attendance/     # Attendance tracking
│   │   │   ├── payroll/        # Payroll processing
│   │   │   ├── leave/          # Leave management
│   │   │   ├── kpi/            # Performance KPIs
│   │   │   ├── recruitment/    # ATS module
│   │   │   ├── tasks/          # Task management
│   │   │   ├── dashboard/      # Analytics dashboards
│   │   │   ├── notifications/  # Multi-channel notifications
│   │   │   └── organization/   # Org structure
│   │   └── prisma/
│   │       ├── schema.prisma   # Full database schema
│   │       └── seed.ts         # Demo data
│   ├── web/                    # Next.js Frontend
│   │   └── src/
│   │       ├── app/            # App Router pages
│   │       ├── components/     # UI components
│   │       ├── lib/            # API client, utils
│   │       └── i18n/           # uz/ru/en translations
│   └── mobile/                 # Flutter Mobile App
│       └── lib/
│           ├── screens/        # App screens
│           ├── widgets/        # Reusable widgets
│           └── services/       # API services
├── infrastructure/
│   ├── k8s/                    # Kubernetes manifests
│   └── nginx/                  # Nginx config
├── docker-compose.yml
└── package.json
```

## 🌐 Localization

StaffFlow HR supports 3 languages:
- 🇺🇿 **O'zbek** (default)
- 🇷🇺 **Русский**
- 🇬🇧 **English**

## 📊 Database Schema

The Prisma schema includes 25+ models:
- Multi-tenant architecture
- Full audit trail
- Soft deletes
- Optimized indexes

## 🔐 Security Features

- **RBAC** (Role-Based Access Control)
- **MFA** (TOTP with QR Code)
- **JWT** with refresh token rotation
- **Audit logs** for all critical actions
- **Rate limiting** (throttle)
- **Helmet.js** security headers
- **Data encryption** at rest

## 🚢 Production Deployment

### Kubernetes

```bash
kubectl apply -f infrastructure/k8s/
```

### Environment Variables (Production)

Key variables to set in production:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Strong random secret
- `REDIS_HOST` - Redis connection
- `AWS_*` - AWS S3 for file uploads
- `ESKIZ_*` - Uzbek SMS provider
- `TELEGRAM_BOT_TOKEN` - Telegram notifications
- `OPENAI_API_KEY` - AI features

## 📱 Mobile App

Build Flutter app:

```bash
cd apps/mobile
flutter pub get
flutter run
```

## 🤝 Contributing

1. Fork the repo
2. Create feature branch
3. Submit PR with tests

## 📄 License

MIT License — StaffFlow HR Team

---

**Made with ❤️ in Uzbekistan 🇺🇿**

*Xodimlaringizni qadrlang, biznesni rivojlantiring!*
