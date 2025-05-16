import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/login.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(res: Response, dto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new UnauthorizedException('Unauthorized');

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) throw new UnauthorizedException('Unauthorized');

    const token = await this.jwt.signAsync({ id: user.id, role: user.role });

    res.cookie('_authToken', token, {
      httpOnly: true,
      maxAge: 5 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      success: true,
      message: 'Login successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(res: Response, dto: CreateUserDto) {
    const { data } = await this.userService.createNewUser(dto);

    const token = await this.jwt.signAsync({ id: data.id, role: data.role });

    res.cookie('_authToken', token, {
      httpOnly: true,
      maxAge: 5 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      success: true,
      message: 'Register successfully',
      user: {
        id: data.id,
        email: data.email,
      },
    };
  }
}
