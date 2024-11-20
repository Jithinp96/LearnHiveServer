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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDashboardRepository = void 0;
const CourseOrderModel_1 = require("../database/models/CourseOrderModel");
const SlotOrderModel_1 = require("../database/models/SlotOrderModel");
const StudentModel_1 = require("../database/models/StudentModel");
const TutorModel_1 = require("../database/models/TutorModel");
class AdminDashboardRepository {
    countStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            return StudentModel_1.StudentModel.countDocuments({ isBlocked: false });
        });
    }
    countTutors() {
        return __awaiter(this, void 0, void 0, function* () {
            return TutorModel_1.TutorModel.countDocuments({ isBlocked: false });
        });
    }
    calculateCourseRevenue() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = yield CourseOrderModel_1.CourseOrder.aggregate([
                { $match: { paymentStatus: 'Completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]);
            return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
        });
    }
    calculateSlotRevenue() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = yield SlotOrderModel_1.SlotOrder.aggregate([
                { $match: { paymentStatus: 'Completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]);
            return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
        });
    }
    getTopCourses(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return CourseOrderModel_1.CourseOrder.aggregate([
                { $match: { paymentStatus: 'Completed' } },
                { $group: { _id: '$courseId', count: { $sum: 1 }, revenue: { $sum: '$amount' } } },
                { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'courseInfo' } },
                { $unwind: '$courseInfo' },
                { $project: { title: '$courseInfo.title', count: 1, revenue: 1 } },
                { $sort: { count: -1 } },
                { $limit: limit },
            ]);
        });
    }
    getTopCategories(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return CourseOrderModel_1.CourseOrder.aggregate([
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
        });
    }
    getTopTutors(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return CourseOrderModel_1.CourseOrder.aggregate([
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
        });
    }
}
exports.AdminDashboardRepository = AdminDashboardRepository;
