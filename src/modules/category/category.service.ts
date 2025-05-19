import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getAllCategories() {
    return await this.prisma.category.findMany({
      include: {
        movies: true,
      },
    });
  }

  async createCategory(data: CreateCategoryDto) {
    const exists = await this.prisma.category.findFirst({
      where: {
        name: data.name,
      },
    });

    if (exists) throw new ConflictException('Category already exists');

    const newCategory = await this.prisma.category.create({
      data,
    });

    return {
      success: true,
      message: 'Category created successfully',
      data: newCategory,
    };
  }
}
