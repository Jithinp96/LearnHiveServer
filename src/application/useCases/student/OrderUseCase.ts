import { CourseOrder } from "../../../domain/entities/CourseOrder";
import { SlotOrder } from "../../../domain/entities/SlotOrder";
import { OrderRepository } from "../../../infrastructure/repositories/OrderRepository";

export class OrderUseCase {
    constructor(
        private _orderRepo: OrderRepository
    ) {}

    async getCourseOrders(studentId: string): Promise<CourseOrder[]> {
        return this._orderRepo.getCourseOrderByStudentId(studentId)
    }

    async getSlotOrders(studentId: string): Promise<SlotOrder[]> {
        return this._orderRepo.getSlotOrderByStudentId(studentId)
    }
}