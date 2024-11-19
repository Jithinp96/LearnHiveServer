import { IAdminDashboardRepository } from "../../domain/interfaces/IAdminDashboardRepository";
import { CourseOrder as CourseOrderModel } from "../database/models/CourseOrderModel";
import { SlotOrder as SlotOrderModel } from "../database/models/SlotOrderModel";
import { StudentModel } from "../database/models/StudentModel";
import { TutorModel } from "../database/models/TutorModel";


export class AdminDashboardRepository implements IAdminDashboardRepository {
  async countStudents(): Promise<number> {
    return StudentModel.countDocuments({ isBlocked: false });
  }

  async countTutors(): Promise<number> {
    return TutorModel.countDocuments({ isBlocked: false });
  }

  async calculateCourseRevenue(): Promise<number> {
    const result = await CourseOrderModel.aggregate([
      { $match: { paymentStatus: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    return result[0]?.total || 0;
  }

  async calculateSlotRevenue(): Promise<number> {
    const result = await SlotOrderModel.aggregate([
      { $match: { paymentStatus: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    return result[0]?.total || 0;
  }

  async getTopCourses(limit: number): Promise<any[]> {
    return CourseOrderModel.aggregate([
      { $match: { paymentStatus: 'Completed' } },
      { $group: { _id: '$courseId', count: { $sum: 1 }, revenue: { $sum: '$amount' } } },
      { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'courseInfo' } },
      { $unwind: '$courseInfo' },
      { $project: { title: '$courseInfo.title', count: 1, revenue: 1 } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);
  }

  async getTopCategories(limit: number): Promise<any[]> {
    return CourseOrderModel.aggregate([
      { $match: { paymentStatus: 'Completed' } },
      { $lookup: { from: 'courses', localField: 'courseId', foreignField: '_id', as: 'courseInfo' } },
      { $unwind: '$courseInfo' },
      { $group: { _id: '$courseInfo.category', count: { $sum: 1 }, revenue: { $sum: '$amount' } } },
      { $lookup: { from: 'coursecategories', localField: '_id', foreignField: '_id', as: 'categoryInfo' } },
      { $unwind: '$categoryInfo' },
      { $project: { name: '$categoryInfo.name', count: 1, revenue: 1 } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);
  }

  async getTopTutors(limit: number): Promise<any[]> {
    return CourseOrderModel.aggregate([
      { $match: { paymentStatus: 'Completed' } },
      { $lookup: { from: 'courses', localField: 'courseId', foreignField: '_id', as: 'courseInfo' } },
      { $unwind: '$courseInfo' },
      { $group: { _id: '$courseInfo.tutorId', earnings: { $sum: '$amount' }, studentsCount: { $addToSet: '$studentId' } } },
      { $lookup: { from: 'tutors', localField: '_id', foreignField: '_id', as: 'tutorInfo' } },
      { $unwind: '$tutorInfo' },
      { $project: { name: '$tutorInfo.name', earnings: 1, studentsCount: { $size: '$studentsCount' } } },
      { $sort: { earnings: -1 } },
      { $limit: limit },
    ]);
  }
}