import { BadRequestException, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MulterModule } from '@nestjs/platform-express';
import { v4 as uuid4 } from 'uuid';
import { diskStorage } from 'multer';
import { extname } from 'node:path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/images',
        filename(req, file, callback) {
          console.log(file.originalname);
          const ext: string = extname(file.originalname);
          const uuid: string = uuid4();
          callback(null, `${uuid}${ext}`);
        },
      }),
      fileFilter(req, file, callback) {
        console.log(file.mimetype);

        if (!file.mimetype.startsWith('image/')) {
          callback(new BadRequestException('Only images are allowed'), false);
        }
      },
      limits: { fileSize: 1024 * 1024 * 6 },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
