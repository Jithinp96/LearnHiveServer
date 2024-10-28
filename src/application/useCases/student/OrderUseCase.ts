import { ICourseOrder } from "../../../domain/entities/ICourseOrder";
import { ISlotOrder } from "../../../domain/entities/ISlotOrder";
import { OrderRepository } from "../../../infrastructure/repositories/OrderRepository";

export class OrderUseCase {
    constructor(
        private _orderRepo: OrderRepository
    ) {}

    async getCourseOrders(studentId: string): Promise<ICourseOrder[]> {
        return this._orderRepo.getCourseOrderByStudentId(studentId)
    }

    async getSlotOrders(studentId: string): Promise<ISlotOrder[]> {
        return this._orderRepo.getSlotOrderByStudentId(studentId)
    }
}