import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Post('new')
  async addNewUser(
    @Body() newUser: CreateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      newUser.avatarImage = file.filename;
    }

    return this.userService.createNewUser(newUser);
  }
}
