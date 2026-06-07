import { Module } from '@nestjs/common';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { OneCAdapter } from './adapters/onec.adapter';
import { UzAsboAdapter } from './adapters/uzasbo.adapter';
import { BitrixAdapter } from './adapters/bitrix.adapter';

@Module({
  controllers: [IntegrationsController],
  providers: [IntegrationsService, OneCAdapter, UzAsboAdapter, BitrixAdapter],
  exports: [IntegrationsService],
})
export class IntegrationsModule {}
