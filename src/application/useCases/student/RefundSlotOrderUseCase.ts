import Stripe from 'stripe';

import { IOrderRepository } from '../../../domain/interfaces/IOrderRepository';
import { ISlotOrder } from '../../../domain/entities/ISlotOrder';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-09-30.acacia' 
});

export class RefundSlotOrderUseCase {
  private _orderRepo: IOrderRepository;

  constructor(orderRepo: IOrderRepository) {
    this._orderRepo = orderRepo;
  }

  async execute(slotOrderId: string, studentId: string): Promise<ISlotOrder> {
    const slotOrder = await this._orderRepo.getSlotOrderById(slotOrderId);

    if (!slotOrder) {
      throw new Error('Slot order not found');
    }

    if (slotOrder.paymentStatus !== 'Completed') {
      throw new Error('Refund is allowed only for completed orders');
    }

    const refund = await stripe.refunds.create({
        payment_intent: slotOrder.paymentId,
        amount: Math.round(slotOrder.amount * 100),
    });

    slotOrder.sessionStatus = 'Cancelled';
    slotOrder.refundId = refund.id;

    return this._orderRepo.updateSlotOrder(slotOrder);
  }
}