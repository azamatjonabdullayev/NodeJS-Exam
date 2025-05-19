import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async getAllReviews() {
    return await this.prisma.review.findMany({
      include: {
        user: true,
        movie: true,
      },
    });
  }

  async getReviewsByUser(userId: string) {
    const exists = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!exists) {
      throw new NotFoundException('User not found');
    }

    return await this.prisma.review.findMany({
      where: { userId },
      include: {
        user: true,
        movie: true,
      },
    });
  }

  async getReviewsByMovie(movieId: string) {
    const exists = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!exists) {
      throw new NotFoundException('Movie not found');
    }
    return await this.prisma.review.findMany({
      where: { movieId },
      include: {
        user: true,
        movie: true,
      },
    });
  }

  async createReview(data: CreateReviewDto) {
    const exists = await this.prisma.review.findFirst({
      where: {
        AND: [
          {
            userId: data.userId,
          },
          {
            movieId: data.movieId,
          },
        ],
      },
    });

    if (exists) {
      throw new BadRequestException('Review already exists');
    }

    const review = await this.prisma.review.create({
      data,
      include: {
        user: true,
        movie: true,
      },
    });

    return {
      message: 'Review created successfully',
      review,
    };
  }

  async updateReview(id: string, data: Partial<CreateReviewDto>) {
    const exists = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException('Review not found');
    }

    const review = await this.prisma.review.update({
      where: { id },
      data,
      include: {
        user: true,
        movie: true,
      },
    });

    return {
      message: 'Review updated successfully',
      review,
    };
  }

  async deleteReview(id: string) {
    const exists = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException('Review not found');
    }

    await this.prisma.review.delete({
      where: { id },
    });

    return {
      message: 'Review deleted successfully',
    };
  }
}
