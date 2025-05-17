import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ChekRolesGuard } from 'src/common/guards/check-role.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUsers() {
    return await this.userService.getAllUsers();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @UseGuards(AuthGuard, ChekRolesGuard)
  @Post('new')
  @UseInterceptors(FileInterceptor('avatarImage'))
  async addNewUser(
    @Body() newUser: CreateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      newUser.avatarImage = file.filename;
    }

    return await this.userService.createNewUser(newUser);
  }

  @UseGuards(AuthGuard)
  @Post(':id/update')
  @UseInterceptors(FileInterceptor('avatarImage'))
  async updateUser(
    @Param('id') id: string,
    @Body() updData: Partial<CreateUserDto>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      updData.avatarImage = file.filename;
    }

    return await this.userService.updateUser(id, updData);
  }

  @UseGuards(AuthGuard, ChekRolesGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }
}
