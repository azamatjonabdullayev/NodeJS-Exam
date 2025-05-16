import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { User } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async searchIdDev(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }
  //! Search by id for dev purposes ☝️☝️☝️

  async getAllUsers(): Promise<{ success: boolean; data: User[] }> {
    const users = await this.prisma.user.findMany();
    return {
      success: true,
      data: users,
    };
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return {
      success: true,
      data: {
        ...user,
        password: null,
      },
    };
  }

  async createNewUser(newUser: CreateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: newUser.email,
          },
          {
            username: newUser.username,
          },
        ],
      },
    });

    if (user) throw new ConflictException('Username or email already in use');

    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashedPassword;

    const createdUser = await this.prisma.user.create({
      data: newUser,
    });

    return {
      success: true,
      data: createdUser,
    };
  }

  async updateUser(id: string, updatedData: Partial<CreateUserDto>) {
    const user = await this.searchIdDev(id);

    if (updatedData.password) {
      const cmp = await bcrypt.compare(updatedData.password, user.password);

      if (!cmp) throw new ConflictException('Password is incorrect!');

      updatedData.password = await bcrypt.hash(updatedData.password, 12);
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: updatedData,
    });

    return {
      success: true,
      data: updatedUser,
    };
  }

  async deleteUser(id: string) {
    await this.searchIdDev(id);

    await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: 'User deleted successfully',
    };
  }
}
