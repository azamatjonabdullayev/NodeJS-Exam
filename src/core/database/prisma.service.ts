import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private logger = new Logger('Bu PrismaService');
  async onModuleInit() {
    this.logger.log('Prisma ishga tushmoqda');
    await this.$connect();
    this.logger.log('Prisma ishga tushdi');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.error('Prisma ishdan chiqdi');
  }
}
