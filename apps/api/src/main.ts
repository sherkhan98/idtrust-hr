import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const compression = require('compression');
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 4000);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  app.use(helmet());
  app.use(compression());

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://app.staffflow.uz',
      configService.get('APP_URL'),
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID'],
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  if (nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('StaffFlow HR API')
      .setDescription('Enterprise HRM Platform API - StaffFlow HR')
      .setVersion('1.0.0')
      .addBearerAuth()
      .addTag('Auth', 'Authentication & Authorization')
      .addTag('Employees', 'Employee Management')
      .addTag('Attendance', 'Attendance Tracking')
      .addTag('Payroll', 'Payroll Processing')
      .addTag('Leave', 'Leave Management')
      .addTag('KPI', 'Performance Management')
      .addTag('Recruitment', 'ATS & Recruitment')
      .addTag('Tasks', 'Task Management')
      .addTag('Dashboard', 'Analytics & Dashboards')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
    logger.log(`Swagger docs: http://localhost:${port}/api/docs`);
  }

  await app.listen(port);
  logger.log(`🚀 StaffFlow HR API running on port ${port}`);
  logger.log(`Environment: ${nodeEnv}`);
}

bootstrap();
