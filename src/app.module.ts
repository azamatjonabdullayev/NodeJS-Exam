import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [CoreModule, UserModule, AuthModule, SubscriptionModule, PaymentModule],
})
export class AppModule {}
