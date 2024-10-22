import { CourseOrder } from "../entities/CourseOrder";
import { SlotOrder } from "../entities/SlotOrder";

export interface IOrderRepository {
  getCourseOrderByStudentId(studentId: string): Promise<CourseOrder[]>;
  getSlotOrderByStudentId(studentId: string): Promise<SlotOrder[]>;
}