import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('favourite')
export class FavouriteController {
  constructor(private readonly favouriteService: FavouriteService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getUserFavs(@Req() req: Request) {
    const id: string = (req as any).user.id;
    return await this.favouriteService.getFavourites(id);
  }

  @Post('add/:id')
  @UseGuards(AuthGuard)
  async addToFav(@Req() req: Request, @Param('id') movieId: string) {
    const userId: string = (req as any).user.id;

    return await this.favouriteService.addMovieToFav({ userId, movieId });
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  async deleteFromFav(@Req() req: Request, @Param('id') movieId: string) {
    const userId: string = (req as any).user.id;

    return await this.favouriteService.removeFromFav({ userId, movieId });
  }
}
