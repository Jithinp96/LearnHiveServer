import { ICourseOrder } from "../entities/ICourseOrder";
import { IPaginationOptions } from "../entities/IPaginationOptions";
import { ISlotOrder } from "../entities/ISlotOrder";

export interface IOrderRepository {
  // getCourseOrderByStudentId(studentId: string): Promise<ICourseOrder[]>;
  getCourseOrderByStudentId(studentId: string, options: IPaginationOptions): Promise<{ courseOrders: ICourseOrder[]; totalOrders: number;totalPages: number; currentPage: number }>
  // getSlotOrderByStudentId(studentId: string): Promise<ISlotOrder[]>;
  getSlotOrderByStudentId(studentId: string, options: IPaginationOptions): Promise<{ slotOrders: ISlotOrder[]; totalOrders: number;totalPages: number; currentPage: number }>
  getSlotOrderById(slotOrderId: string): Promise<ISlotOrder>;
  updateSlotOrder(slotOrder: ISlotOrder): Promise<ISlotOrder>;
  updateCompletionStatus(studentId: string, courseId: string, status: string): Promise<void>;

  getTopPurchasedCourses(limit: number): Promise<any>;
}