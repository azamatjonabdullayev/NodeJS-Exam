import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT,
      signOptions: { expiresIn: '5h' },
    }),
    ServeStaticModule.forRoot({
      rootPath: 'uploads',
      serveRoot: '/uploads',
    }),
    PrismaModule,
  ],
})
export class CoreModule {}
