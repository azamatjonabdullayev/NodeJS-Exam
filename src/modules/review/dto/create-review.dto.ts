import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  movieId: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @IsString()
  @IsNotEmpty()
  comment?: string;
}
