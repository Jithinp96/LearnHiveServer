import { Types } from 'mongoose';

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

  async getSlotOrderById(slotOrderId: string): Promise<ISlotOrder> {
    const slotOrder = await SlotOrderModel.findById(slotOrderId).lean().exec();
    if (!slotOrder) {
      throw new Error(`Slot order with ID ${slotOrderId} not found`);
    }
    return {
      ...slotOrder,
      _id: slotOrder._id.toString(),
    } as ISlotOrder;
  }
  
  async updateSlotOrder(slotOrder: ISlotOrder): Promise<ISlotOrder> {
    const updatedOrder = await SlotOrderModel.findByIdAndUpdate(slotOrder._id, slotOrder, { new: true }).lean().exec();
    if (!updatedOrder) {
      throw new Error(`Failed to update slot order with ID ${slotOrder._id}`);
    }
    return {
      ...updatedOrder,
      _id: updatedOrder._id.toString(),
    } as ISlotOrder;
  }
}