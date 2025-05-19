import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { UserService } from '../user/user.service';
import { CreateMovieDto } from './dto/add-movie.dto';
import { MovieFileDto } from './dto/add-movie-file.dto';

@Injectable()
export class MovieService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async getAllMovies() {
    return await this.prisma.movie.findMany({
      include: {
        movie_files: true,
        category: true,
        reviews: true,
      },
    });
  }

  async getMovieById(id: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: {
        movie_files: true,
        category: true,
        reviews: true,
      },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    await this.prisma.movie.update({
      where: { id },
      data: {
        view_count: {
          increment: 1,
        },
      },
    });

    return movie;
  }

  async addMovie(uploaded_by: string, data: CreateMovieDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const movie = await this.prisma.movie.create({
      data: {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        releaseYear: data.releaseYear,
        duration: data.duration,
        subscriptionType: data.subscriptionType || 'BASIC',
        uploaded_by,
        poster_url: data.poster || null,
      },
    });

    return {
      success: true,
      message: 'Movie details added successfully',
      data: movie,
    };
  }

  async updateMovieDetails(id: string, data: Partial<CreateMovieDto>) {
    const exists = await this.prisma.movie.findUnique({
      where: { id },
    });

    if (!exists) throw new NotFoundException('Movie not found');

    const updatedMovie = await this.prisma.movie.update({
      where: { id },
      data: {
        ...data,
        poster_url: data.poster || exists.poster_url,
      },
    });

    return {
      success: true,
      message: 'Movie details updated successfully',
      data: updatedMovie,
    };
  }

  async addMovieFile(data: MovieFileDto) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: data.movieId },
    });

    if (!movie) throw new NotFoundException('Movie not found');

    if (!data.movieFile)
      throw new BadRequestException('Movie file is required');

    const movieFile = await this.prisma.movieFiles.create({
      data: {
        movieId: data.movieId,
        video_url: data.movieFile,
        language: data.language || 'uz',
        quality: data.quality || 'p4K',
      },
    });

    return {
      success: true,
      message: 'Movie file added successfully',
      data: movieFile,
    };
  }

  async updateMovieFile(id: string, data: Partial<MovieFileDto>) {
    const movieFile = await this.prisma.movieFiles.findUnique({
      where: { id },
    });

    if (!movieFile) throw new NotFoundException('Movie file not found');

    const updatedFile = await this.prisma.movieFiles.update({
      where: { id },
      data: {
        quality: data.quality || movieFile.quality,
        language: data.language || movieFile.language,
        video_url: data.movieFile || movieFile.video_url,
      },
    });

    return {
      success: true,
      message: 'Movie file updated successfully',
      data: updatedFile,
    };
  }

  async deleteMovie(id: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) throw new NotFoundException('Movie not found');

    await this.prisma.movie.delete({
      where: { id },
    });

    await this.prisma.movieFiles.deleteMany({
      where: { movieId: id },
    });
  }
}
