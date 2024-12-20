import { IPaymentRepository } from '../../domain/interfaces/IPaymentRepository';
import { CourseOrder } from '../database/models/CourseOrderModel';
import { SlotOrder } from '../database/models/SlotOrderModel';

export class PaymentRepository implements IPaymentRepository {
    async saveOrderDetails(order: any): Promise<any> {
        if (order.courseId) {
            return await CourseOrder.create(order);
        } else if (order.slotId) {
            return await SlotOrder.create(order);
        }
    }

    async updateOrderStatus(orderId: string, status: string): Promise<any> {
        return await SlotOrder.findByIdAndUpdate(orderId, { status }, { new: true });
    }

    async getOrderById(orderId: string): Promise<any> {
        return await SlotOrder.findById(orderId);
    }
}