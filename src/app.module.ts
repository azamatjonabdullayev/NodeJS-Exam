import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { PaymentModule } from './modules/payment/payment.module';
import { CategoryModule } from './modules/category/category.module';
import { MovieModule } from './modules/movie/movie.module';
import { FavouriteModule } from './modules/favourite/favourite.module';

@Module({
  imports: [
    CoreModule,
    UserModule,
    AuthModule,
    SubscriptionModule,
    PaymentModule,
    CategoryModule,
    MovieModule,
    FavouriteModule,
  ],
})
export class AppModule {}
