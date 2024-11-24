import { ICourseOrder } from "../entities/ICourseOrder";
import { ISlotOrder } from "../entities/ISlotOrder";

export interface IOrderRepository {
  getCourseOrderByStudentId(studentId: string): Promise<ICourseOrder[]>;
  getSlotOrderByStudentId(studentId: string): Promise<ISlotOrder[]>;
  getSlotOrderById(slotOrderId: string): Promise<ISlotOrder>;
  updateSlotOrder(slotOrder: ISlotOrder): Promise<ISlotOrder>;
  updateCompletionStatus(studentId: string, courseId: string, status: string): Promise<void>;
}