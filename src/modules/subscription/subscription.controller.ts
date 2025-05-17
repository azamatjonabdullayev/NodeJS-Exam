import { Controller, Get, Body, UseGuards, Post, Req } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ChekRolesGuard } from 'src/common/guards/check-role.guard';
import { CreateSubscriptionDto } from './dto/create-subs.dto';
import { PurchasePlanDto } from './dto/purchase-plan.dto';
import { Request } from 'express';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getPlans() {
    return await this.subscriptionService.getAllPlans();
  }

  @Get('subscribed-users')
  @UseGuards(AuthGuard, ChekRolesGuard)
  async getSubscribedUsers() {
    return await this.subscriptionService.getUserSubscriptions();
  }

  @Post('/new')
  @UseGuards(AuthGuard, ChekRolesGuard)
  async createSubscription(@Body() dto: CreateSubscriptionDto) {
    return await this.subscriptionService.addNewSubscription(dto);
  }

  @Post('purchase')
  @UseGuards(AuthGuard)
  async purchasePlan(@Req() req: Request, @Body() dto: PurchasePlanDto) {
    const id = (req as any).user.id;

    return await this.subscriptionService.purchasePlan(id, dto);
  }
}
