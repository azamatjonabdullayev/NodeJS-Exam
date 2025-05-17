import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subs.dto';
import { PurchasePlanDto } from './dto/purchase-plan.dto';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async getAllPlans() {
    return await this.prisma.subscriptionPlans.findMany();
  }

  async getUserSubscriptions() {
    const pendingStatus = await this.prisma.userSubscription.findMany({
      where: {
        status: 'PENDING',
      },
      include: { subscription: true },
    });

    const activeStatus = await this.prisma.userSubscription.findMany({
      where: {
        status: 'ACTIVE',
      },
    });

    const expiredStatus = await this.prisma.userSubscription.findMany({
      where: {
        status: 'EXPIRED',
      },
    });

    return {
      pending: pendingStatus,
      active: activeStatus,
      expired: expiredStatus,
    };
  }

  async addNewSubscription(data: CreateSubscriptionDto) {
    const newPlan = await this.prisma.subscriptionPlans.create({
      data,
    });

    return {
      success: true,
      data: newPlan,
    };
  }

  async purchasePlan(data: PurchasePlanDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) throw new NotFoundException('User not found');

    const plan = await this.prisma.subscriptionPlans.findUnique({
      where: { id: data.planId },
    });

    if (!plan) throw new NotFoundException('Plan not found');

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration_days);

    const newPurchase = await this.prisma.userSubscription.create({
      data: {
        userId: data.userId,
        subscriptionId: data.planId,
        endDate,
      },
    });

    return {
      status: newPurchase.status,
      data: newPurchase,
    };
  }
}
