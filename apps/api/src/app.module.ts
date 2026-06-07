import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import configuration from './config/configuration';
import { PrismaModule } from './common/prisma/prisma.module';
import { RedisModule } from './common/redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { EmployeesModule } from './employees/employees.module';
import { AttendanceModule } from './attendance/attendance.module';
import { PayrollModule } from './payroll/payroll.module';
import { LeaveModule } from './leave/leave.module';
import { KpiModule } from './kpi/kpi.module';
import { RecruitmentModule } from './recruitment/recruitment.module';
import { TasksModule } from './tasks/tasks.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OrganizationModule } from './organization/organization.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { AutomationModule } from './automation/automation.module';
import { HealthController } from './health/health.controller';

@Module({
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),

    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'long', ttl: 60000, limit: 200 },
    ]),

    CacheModule.register({
      isGlobal: true,
      ttl: 300,
      max: 1000,
    }),

    PrismaModule,
    RedisModule,
    AuthModule,
    EmployeesModule,
    AttendanceModule,
    PayrollModule,
    LeaveModule,
    KpiModule,
    RecruitmentModule,
    TasksModule,
    DashboardModule,
    NotificationsModule,
    OrganizationModule,
    IntegrationsModule,
    OnboardingModule,
    AutomationModule,
  ],
})
export class AppModule {}
