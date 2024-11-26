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
      select: "subject level date startTime endTime meetingLink",
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

  async updateCompletionStatus(studentId: string, courseId: string, status: string): Promise<void> {
    await CourseOrderModel.updateOne(
        { studentId, courseId },
        { completionStatus: status }
    );
  }


  async getTopPurchasedCourses(limit: number): Promise<any> {
    return CourseOrderModel.aggregate([
        { $match: { paymentStatus: 'Completed' } },
        { $group: { _id: "$courseId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
        { $lookup: { from: "courses", localField: "_id", foreignField: "_id", as: "course" } },
        { $unwind: "$course" },
        { $project: { _id: 0, course: 1 } }
    ]);
  }

//   async getTopCategories(limit: number): Promise<any> {
//     return CourseOrderModel.aggregate([
//         { $match: { paymentStatus: 'Completed' } },
//         {
//             $lookup: {
//                 from: "courses", // Join with courses collection
//                 localField: "courseId",
//                 foreignField: "_id",
//                 as: "course",
//             },
//         },
//         { $unwind: "$course" },
//         {
//             $group: {
//                 _id: "$course.category", // Group by category ID
//                 count: { $sum: 1 },
//             },
//         },
//         {
//             $lookup: {
//                 from: "coursecategories", // Join with CourseCategory collection
//                 localField: "_id",
//                 foreignField: "_id",
//                 as: "category",
//             },
//         },
//         { $unwind: "$category" }, // Unwind the category array to get a single object
//         {
//             $project: {
//                 _id: 0, // Exclude the original `_id`
//                 categoryId: "$_id", // Include the category ID under a new key
//                 name: "$category.name", // Include the name field from the category
//                 count: 1, // Include the count
//             },
//         },
//         { $sort: { count: -1 } }, // Sort by count in descending order
//         { $limit: limit }, // Limit the number of results
//     ]);
// }
}