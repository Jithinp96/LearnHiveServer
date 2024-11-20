"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorDashboardRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CourseOrderModel_1 = require("../database/models/CourseOrderModel");
const SlotOrderModel_1 = require("../database/models/SlotOrderModel");
class TutorDashboardRepository {
    getCourseRevenueByTutor(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = yield CourseOrderModel_1.CourseOrder.aggregate([
                { $match: { paymentStatus: 'Completed' } },
                { $lookup: { from: 'courses', localField: 'courseId', foreignField: '_id', as: 'course' } },
                { $match: { 'course.tutorId': new mongoose_1.default.Types.ObjectId(tutorId) } },
                { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
            ]);
            return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.totalRevenue) || 0;
        });
    }
    getTotalCoursePurchasesByTutor(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CourseOrderModel_1.CourseOrder.countDocuments({
                paymentStatus: 'Completed',
                'course.tutorId': new mongoose_1.default.Types.ObjectId(tutorId)
            });
        });
    }
    getTrendingCourseByTutor(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield CourseOrderModel_1.CourseOrder.aggregate([
                { $match: { paymentStatus: 'Completed' } },
                { $lookup: { from: 'courses', localField: 'courseId', foreignField: '_id', as: 'course' } },
                { $match: { 'course.tutorId': new mongoose_1.default.Types.ObjectId(tutorId) } },
                { $group: { _id: '$courseId', purchaseCount: { $sum: 1 } } },
                { $sort: { purchaseCount: -1 } },
                { $limit: 1 },
                { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'courseDetails' } },
                { $unwind: '$courseDetails' },
                { $project: { courseId: '$_id', title: '$courseDetails.title', purchaseCount: 1 } }
            ]);
            return result[0] || null;
        });
    }
    getTrendingCoursesByTutor(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield CourseOrderModel_1.CourseOrder.aggregate([
                { $match: { paymentStatus: 'Completed' } },
                {
                    $lookup: {
                        from: 'courses',
                        localField: 'courseId',
                        foreignField: '_id',
                        as: 'course'
                    }
                },
                { $match: { 'course.tutorId': new mongoose_1.default.Types.ObjectId(tutorId) } },
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
        });
    }
    getSlotRevenueByTutor(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = yield SlotOrderModel_1.SlotOrder.aggregate([
                { $match: { paymentStatus: 'Completed', tutorId: new mongoose_1.default.Types.ObjectId(tutorId) } },
                { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
            ]);
            return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.totalRevenue) || 0;
        });
    }
}
exports.TutorDashboardRepository = TutorDashboardRepository;
