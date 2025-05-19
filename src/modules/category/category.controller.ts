import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ChekRolesGuard } from 'src/common/guards/check-role.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('all')
  @UseGuards(AuthGuard)
  async showAllCategories() {
    return await this.categoryService.getAllCategories();
  }

  @Post('new')
  @UseGuards(AuthGuard, ChekRolesGuard)
  async addCategory(@Body() dto: CreateCategoryDto) {
    return await this.categoryService.createCategory(dto);
  }
}
