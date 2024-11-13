import mongoose from 'mongoose';

import { ITutorDashboardRepository } from '../../domain/interfaces/ITutorDahsboardRepository';
import { CourseOrder as CourseOrderModel } from '../database/models/CourseOrderModel';
import { SlotOrder as SlotOrderModel} from '../database/models/SlotOrderModel';

export class TutorDashboardRepository implements ITutorDashboardRepository {
    async getCourseRevenueByTutor(tutorId: string): Promise<number> {
        const result = await CourseOrderModel.aggregate([
            { $match: { paymentStatus: 'Completed' } },
            { $lookup: { from: 'courses', localField: 'courseId', foreignField: '_id', as: 'course' } },
            { $match: { 'course.tutorId': new mongoose.Types.ObjectId(tutorId) } },
            { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
        ]);
        return result[0]?.totalRevenue || 0;
    }
    
    async getTotalCoursePurchasesByTutor(tutorId: string): Promise<number> {
        return await CourseOrderModel.countDocuments({
            paymentStatus: 'Completed',
            'course.tutorId': new mongoose.Types.ObjectId(tutorId)
        });
    }
    
    async getTrendingCourseByTutor(tutorId: string): Promise<{ courseId: string; title: string; purchaseCount: number } | null> {
        const result = await CourseOrderModel.aggregate([
            { $match: { paymentStatus: 'Completed' } },
            { $lookup: { from: 'courses', localField: 'courseId', foreignField: '_id', as: 'course' } },
            { $match: { 'course.tutorId': new mongoose.Types.ObjectId(tutorId) } },
            { $group: { _id: '$courseId', purchaseCount: { $sum: 1 } } },
            { $sort: { purchaseCount: -1 } },
            { $limit: 1 },
            { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'courseDetails' } },
            { $unwind: '$courseDetails' },
            { $project: { courseId: '$_id', title: '$courseDetails.title', purchaseCount: 1 } }
        ]);
        return result[0] || null;
    }
    
    async getTrendingCoursesByTutor(tutorId: string): Promise<{ courseId: string; title: string; purchaseCount: number }[]> {
      const result = await CourseOrderModel.aggregate([
          { $match: { paymentStatus: 'Completed' } },
          { 
              $lookup: { 
                  from: 'courses', 
                  localField: 'courseId', 
                  foreignField: '_id', 
                  as: 'course' 
              } 
          },
          { $match: { 'course.tutorId': new mongoose.Types.ObjectId(tutorId) } },
          { 
              $group: { 
                  _id: '$courseId', 
                  purchaseCount: { $sum: 1 } 
              } 
          },
          { $sort: { purchaseCount: -1 } },
          { $limit: 5 },
          { 
              $lookup: { 
                  from: 'courses', 
                  localField: '_id', 
                  foreignField: '_id', 
                  as: 'courseDetails' 
              } 
          },
          { $unwind: '$courseDetails' },
          { 
              $project: { 
                  courseId: '$_id', 
                  title: '$courseDetails.title',
                  thumbnailUrl: '$courseDetails.thumbnailUrl',
                  purchaseCount: 1 
              } 
          }
      ]);
    
      return result;
    }
    
    async getSlotRevenueByTutor(tutorId: string): Promise<number> {
      const result = await SlotOrderModel.aggregate([
          { $match: { paymentStatus: 'Completed', tutorId: new mongoose.Types.ObjectId(tutorId) } },
          { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
      ]);
      return result[0]?.totalRevenue || 0;
    }
}
