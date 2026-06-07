import { Module } from '@nestjs/common';
import { AutomationController } from './automation.controller';
import { AutomationService } from './automation.service';
import { NotificationService } from './notification.service';

@Module({
  controllers: [AutomationController],
  providers: [AutomationService, NotificationService],
  exports: [AutomationService, NotificationService],
})
export class AutomationModule {}
