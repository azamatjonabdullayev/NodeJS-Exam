import { VideoLanguage, VideoQuality } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class MovieFileDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  movieId!: string;

  @IsString()
  @IsOptional()
  movieFile?: string;

  @IsEnum(VideoQuality)
  @IsOptional()
  quality?: VideoQuality;

  @IsEnum(VideoLanguage)
  @IsOptional()
  language?: VideoLanguage;
}
