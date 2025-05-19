import {
  Controller,
  Get,
  Param,
  UseGuards,
  Body,
  Post,
  Put,
  Delete,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMovieDto } from './dto/add-movie.dto';
import { ChekRolesGuard } from 'src/common/guards/check-role.guard';
import { MovieFileDto } from './dto/add-movie-file.dto';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('all')
  @UseGuards(AuthGuard)
  async getMovies() {
    return await this.movieService.getAllMovies();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getMovieById(@Param('id') id: string) {
    return await this.movieService.getMovieById(id);
  }

  @Post('new')
  @UseGuards(AuthGuard, ChekRolesGuard)
  @UseInterceptors(FileInterceptor('moviePoster'))
  async createMovie(
    @Req() req: Request,
    @Body() movie: CreateMovieDto,
    @UploadedFile() poster: Express.Multer.File,
  ) {
    const id = (req as any).user.id;

    if (poster) movie.poster = poster.filename;

    return await this.movieService.addMovie(id, movie);
  }

  @Post(':id/update')
  @UseGuards(AuthGuard, ChekRolesGuard)
  @UseInterceptors(FileInterceptor('moviePoster'))
  async updateMovieDetails(
    @Param('id') id: string,
    @Body() movie: Partial<CreateMovieDto>,
    @UploadedFile() poster: Express.Multer.File,
  ) {
    if (poster) movie.poster = poster.filename;

    return await this.movieService.updateMovieDetails(id, movie);
  }

  @Post('video/post')
  @UseGuards(AuthGuard, ChekRolesGuard)
  @UseInterceptors(FileInterceptor('movieVideo'))
  async addMovieVideo(
    @Body() dto: MovieFileDto,
    @UploadedFile() video: Express.Multer.File,
  ) {
    dto.movieFile = video.filename;

    return await this.movieService.addMovieFile(dto);
  }

  @Post('video/update/:id')
  @UseGuards(AuthGuard, ChekRolesGuard)
  @UseInterceptors(FileInterceptor('movieVideo'))
  async updateMovieFiles(
    @Param('id') id: string,
    @Body() dto: Partial<MovieFileDto>,
    @UploadedFile() video: Express.Multer.File,
  ) {
    if (video) dto.movieFile = video.filename;

    return await this.movieService.updateMovieFile(id, dto);
  }
}
