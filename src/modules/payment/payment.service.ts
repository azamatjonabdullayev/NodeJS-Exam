import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { PaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async getAllPayments() {
    return await this.prisma.payment.findMany();
  }

  async payForSubs(data: PaymentDto) {
    const subsPlan = await this.prisma.userSubscription.findUnique({
      where: { id: data.userSubsID },
      include: {
        subscription: true,
      },
    });

    if (!subsPlan) throw new NotFoundException('Subscription not found');

    const alreadyPayed = await this.prisma.payment.findFirst({
      where: {
        userSubscriptionId: data.userSubsID,
      },
      include: {
        userSubscription: true,
      },
    });

    if (alreadyPayed && alreadyPayed.userSubscription.status === 'ACTIVE')
      throw new BadRequestException('Already paid and active');

    if (subsPlan.subscription.price > data.amount)
      throw new BadRequestException('Not enough money');

    if (subsPlan.subscription.price < data.amount) {
      subsPlan.subscription.price = data.amount;
    }

    const payment = await this.prisma.payment.create({
      data: {
        userSubscriptionId: data.userSubsID,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        externalTransactionId: data.externalTransactionId,
      },
    });

    await this.prisma.userSubscription.update({
      where: { id: data.userSubsID },
      data: {
        status: 'ACTIVE',
      },
    });

    return {
      message: 'Payment successful',
      payment,
    };
  }
}
