import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { SignInDto } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseInterceptors(FileInterceptor(''))
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: SignInDto,
  ) {
    return this.authService.login(res, dto);
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('avatarImage'))
  async signUp(
    @Res({ passthrough: true }) res: Response,
    @Body() newUser: CreateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      newUser.avatarImage = file.filename;
    }

    return await this.authService.register(res, newUser);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('_authToken', { path: '/' });

    return {
      success: true,
      message: 'Logout successfully',
    };
  }
}
