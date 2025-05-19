import { PlanTier } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsOptional()
  poster?: string;

  @Type(() => Number)
  @IsInt()
  releaseYear: number;

  @Type(() => Number)
  @IsPositive()
  duration: number;

  @IsOptional()
  @IsEnum(PlanTier, { message: 'Invalid subscription type' })
  subscriptionType?: PlanTier;
}
