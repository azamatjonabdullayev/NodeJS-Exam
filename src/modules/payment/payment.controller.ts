import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDto } from './dto/payment.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ChekRolesGuard } from 'src/common/guards/check-role.guard';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  @UseGuards(AuthGuard, ChekRolesGuard)
  async getPayments() {
    return await this.paymentService.getAllPayments();
  }

  @Post('/pay')
  @UseGuards(AuthGuard)
  async createPayment(@Body() dto: PaymentDto) {
    return await this.paymentService.payForSubs(dto);
  }
}
