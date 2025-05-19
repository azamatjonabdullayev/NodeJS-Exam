import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { AddFavourite } from './dto/add-favourite.dto';

@Injectable()
export class FavouriteService {
  constructor(private prisma: PrismaService) {}

  async getFavourites(userId: string) {
    const favourites = await this.prisma.favourite.findMany({
      where: {
        userId,
      },
      include: {
        movie: true,
      },
    });

    return {
      success: true,
      data: favourites,
    };
  }

  async addMovieToFav(data: AddFavourite) {
    const movieExists = await this.prisma.movie.findUnique({
      where: {
        id: data.movieId,
      },
    });

    if (!movieExists) throw new NotFoundException('Movie not found');

    const inFav = await this.prisma.favourite.findFirst({
      where: {
        AND: [{ userId: data.userId }, { movieId: data.movieId }],
      },
    });

    if (inFav) throw new BadRequestException('Movie already in favourites');

    const added = await this.prisma.favourite.create({
      data: {
        userId: data.userId,
        movieId: data.movieId,
      },
    });

    return {
      success: true,
      message: 'Movie added to favourites',
      data: added,
    };
  }

  async removeFromFav(dto: AddFavourite) {
    await this.prisma.favourite.delete({
      where: {
        userId_movieId: {
          userId: dto.userId,
          movieId: dto.movieId,
        },
      },
    });

    return {
      success: true,
      message: 'Movie removed from favourites',
    };
  }
}
