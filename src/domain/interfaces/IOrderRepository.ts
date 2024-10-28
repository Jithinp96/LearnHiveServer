import { CourseOrder } from "../entities/ICourseOrder";
import { SlotOrder } from "../entities/ISlotOrder";

export interface IOrderRepository {
  getCourseOrderByStudentId(studentId: string): Promise<CourseOrder[]>;
  getSlotOrderByStudentId(studentId: string): Promise<SlotOrder[]>;
}