import { CourseOrder } from "../../domain/entities/CourseOrder";
import { SlotOrder } from "../../domain/entities/SlotOrder";
import { IOrderRepository } from "../../domain/interfaces/IOrderRepository";
import { CourseOrder as CourseOrderModel } from "../database/models/CourseOrderModel";
import { SlotOrder as SlotOrderModel} from "../database/models/SlotOrderModel";

export class OrderRepository implements IOrderRepository {
  async getCourseOrderByStudentId(studentId: string): Promise<CourseOrder[]> {
    return CourseOrderModel.find({ studentId });
  }

  async getSlotOrderByStudentId(studentId: string): Promise<SlotOrder[]> {
    return SlotOrderModel.find({ studentId });
  }
}