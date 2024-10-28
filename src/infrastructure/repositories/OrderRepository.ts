import { ICourseOrder } from "../../domain/entities/ICourseOrder";
import { ISlotOrder } from "../../domain/entities/ISlotOrder";
import { IOrderRepository } from "../../domain/interfaces/IOrderRepository";
import { CourseOrder as CourseOrderModel } from "../database/models/CourseOrderModel";
import { SlotOrder as SlotOrderModel} from "../database/models/SlotOrderModel";

export class OrderRepository implements IOrderRepository {
  async getCourseOrderByStudentId(studentId: string): Promise<ICourseOrder[]> {
    return CourseOrderModel.find({ studentId })
    .populate({
      path: "courseId",
      select: "title category thumbnailUrl level duration reviews",
      populate: {
        path: 'category',
        select: 'name',
      }
    })
    .then((orders) => orders as ICourseOrder[]);
  }

  async getSlotOrderByStudentId(studentId: string): Promise<ISlotOrder[]> {
    return SlotOrderModel.find({ studentId })
    .populate({
      path: "slotId",
      select: "subject level date startTime endTime",
    })
    .then((slots) => slots as ISlotOrder[]);
  }
}