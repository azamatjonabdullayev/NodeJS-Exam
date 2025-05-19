import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid4 } from 'uuid';
import { extname } from 'path';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    MulterModule.register({
      storage: diskStorage({
        destination(req, file, callback) {
          let uploadPath = './uploads/movies';
          if (file.mimetype.startsWith('image/')) uploadPath += '/posters';
          else if (file.mimetype.startsWith('video/')) uploadPath += '/videos';

          callback(null, uploadPath);
        },
        filename(req, file, callback) {
          const ext = extname(file.originalname);
          const uuid = uuid4();
          callback(null, `${uuid}${ext}`);
        },
      }),
    }),
  ],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
