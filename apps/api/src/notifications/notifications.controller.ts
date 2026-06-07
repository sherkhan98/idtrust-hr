import { Controller, Get, Put, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get() getAll(@CurrentUser('id') userId: string, @Query('page') page?: number) { return this.notificationsService.getUserNotifications(userId, page); }
  @Put(':id/read') markRead(@Param('id') id: string, @CurrentUser('id') userId: string) { return this.notificationsService.markAsRead(id, userId); }
  @Put('mark-all-read') markAllRead(@CurrentUser('id') userId: string) { return this.notificationsService.markAllRead(userId); }
}
