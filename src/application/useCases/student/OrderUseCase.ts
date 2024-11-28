import { ICourseOrder } from "../../../domain/entities/ICourseOrder";
import { ISlotOrder } from "../../../domain/entities/ISlotOrder";
import { OrderRepository } from "../../../infrastructure/repositories/OrderRepository";

export class OrderUseCase {
    constructor(
        private _orderRepo: OrderRepository
    ) {}

    async getCourseOrders(studentId: string, page?: number, limit?: number): Promise<{ courseOrders:ICourseOrder[]; totalOrders: number; totalPages: number; currentPage: number }> {
        return this._orderRepo.getCourseOrderByStudentId(studentId, { page, limit })
    }

    // async getSlotOrders(studentId: string): Promise<ISlotOrder[]> {
    //     return this._orderRepo.getSlotOrderByStudentId(studentId)
    // }

    async getSlotOrders(studentId: string, page?: number, limit?: number): Promise<{ slotOrders: ISlotOrder[]; totalOrders: number; totalPages: number; currentPage: number }> {
        return this._orderRepo.getSlotOrderByStudentId(studentId, { page, limit });
      }

    async updateCompletionStatus(studentId: string, courseId: string, completionStatus: string) {
        return this._orderRepo.updateCompletionStatus(studentId, courseId, completionStatus)
    }
}