import { IsEnum, IsString, IsBoolean, IsOptional, IsObject } from 'class-validator';
import { IntegrationType } from '@prisma/client';

export class CreateIntegrationDto {
  @IsEnum(IntegrationType)
  type: IntegrationType;

  @IsString()
  name: string;

  @IsObject()
  config: Record<string, any>;
}

export class UpdateIntegrationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsObject()
  config?: Record<string, any>;
}

export class SyncIntegrationDto {
  @IsString()
  syncType: string;
}
