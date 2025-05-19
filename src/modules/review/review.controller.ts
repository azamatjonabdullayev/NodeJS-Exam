import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ChekRolesGuard } from 'src/common/guards/check-role.guard';
import { Request } from 'express';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('all')
  @UseGuards(AuthGuard, ChekRolesGuard)
  async getAllComments() {
    return await this.reviewService.getAllReviews();
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async getUserComments(@Req() req: Request) {
    const userId = (req as any).user.id;
    return await this.reviewService.getReviewsByUser(userId);
  }

  @Get('movie/:movieId')
  @UseGuards(AuthGuard)
  async getMovieComments(@Param('movieId') movieId: string) {
    return await this.reviewService.getReviewsByMovie(movieId);
  }

  @Post(':movieId/comment')
  @UseGuards(AuthGuard)
  async createComment(
    @Req() req: Request,
    @Param('movieId') movieId: string,
    @Body() body: { rating: number; comment?: string },
  ) {
    const userId = (req as any).user.id;

    return await this.reviewService.createReview({ userId, movieId, ...body });
  }

  @Post(':id/update')
  @UseGuards(AuthGuard)
  async updateComment(
    @Param('id') id: string,
    @Body() body: { rating: number; comment?: string },
  ) {
    return await this.reviewService.updateReview(id, body);
  }

  @Delete(':id/delete')
  @UseGuards(AuthGuard)
  async deleteComment(@Param('id') id: string) {
    return await this.reviewService.deleteReview(id);
  }
}
