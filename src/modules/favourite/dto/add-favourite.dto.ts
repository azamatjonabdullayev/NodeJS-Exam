import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AddFavourite {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  movieId: string;
}
