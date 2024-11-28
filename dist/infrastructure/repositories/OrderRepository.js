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
exports.OrderRepository = void 0;
const CourseOrderModel_1 = require("../database/models/CourseOrderModel");
const SlotOrderModel_1 = require("../database/models/SlotOrderModel");
class OrderRepository {
    getCourseOrderByStudentId(studentId_1) {
        return __awaiter(this, arguments, void 0, function* (studentId, options = { page: 1, limit: 6 }) {
            const page = options.page || 1;
            const limit = options.limit || 6;
            const skip = (page - 1) * limit;
            // return CourseOrderModel.find({ studentId })
            // .populate({
            //   path: "courseId",
            //   select: "title category thumbnailUrl level duration reviews",
            //   populate: {
            //     path: 'category',
            //     select: 'name',
            //   }
            // })
            // .sort({ 'createdAt': -1 })
            // .then((orders) => orders as ICourseOrder[]);
            const [courseOrders, totalOrders] = yield Promise.all([
                CourseOrderModel_1.CourseOrder.find({ studentId })
                    .populate({
                    path: "courseId",
                    select: "title category thumbnailUrl level duration reviews",
                    populate: {
                        path: 'category',
                        select: 'name',
                    }
                })
                    .sort({ 'createdAt': -1 })
                    .skip(skip)
                    .limit(limit)
                    .then((slots) => slots),
                CourseOrderModel_1.CourseOrder.countDocuments({ studentId })
            ]);
            return {
                courseOrders,
                totalOrders,
                totalPages: Math.ceil(totalOrders / limit),
                currentPage: page
            };
        });
    }
    // async getSlotOrderByStudentId(studentId: string): Promise<ISlotOrder[]> {
    //   const slotOrders = await SlotOrderModel.find({ studentId })
    //   .populate({
    //     path: "slotId",
    //     select: "subject level date startTime endTime meetingLink",
    //   })
    //   .sort({ 'createdAt': -1 })
    //   .then((slots) => slots as ISlotOrder[]);
    //   return slotOrders
    // }
    getSlotOrderByStudentId(studentId_1) {
        return __awaiter(this, arguments, void 0, function* (studentId, options = { page: 1, limit: 5 }) {
            const page = options.page || 1;
            const limit = options.limit || 5;
            const skip = (page - 1) * limit;
            const [slotOrders, totalOrders] = yield Promise.all([
                SlotOrderModel_1.SlotOrder.find({ studentId })
                    .populate({
                    path: "slotId",
                    select: "subject level date startTime endTime meetingLink",
                })
                    .sort({ 'createdAt': -1 })
                    .skip(skip)
                    .limit(limit)
                    .then((slots) => slots),
                SlotOrderModel_1.SlotOrder.countDocuments({ studentId })
            ]);
            return {
                slotOrders,
                totalOrders,
                totalPages: Math.ceil(totalOrders / limit),
                currentPage: page
            };
        });
    }
    getSlotOrderById(slotOrderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const slotOrder = yield SlotOrderModel_1.SlotOrder.findById(slotOrderId).lean().exec();
            if (!slotOrder) {
                throw new Error(`Slot order with ID ${slotOrderId} not found`);
            }
            return Object.assign(Object.assign({}, slotOrder), { _id: slotOrder._id.toString() });
        });
    }
    updateSlotOrder(slotOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedOrder = yield SlotOrderModel_1.SlotOrder.findByIdAndUpdate(slotOrder._id, slotOrder, { new: true }).lean().exec();
            if (!updatedOrder) {
                throw new Error(`Failed to update slot order with ID ${slotOrder._id}`);
            }
            return Object.assign(Object.assign({}, updatedOrder), { _id: updatedOrder._id.toString() });
        });
    }
    updateCompletionStatus(studentId, courseId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield CourseOrderModel_1.CourseOrder.updateOne({ studentId, courseId }, { completionStatus: status });
        });
    }
    getTopPurchasedCourses(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return CourseOrderModel_1.CourseOrder.aggregate([
                { $match: { paymentStatus: 'Completed' } },
                { $group: { _id: "$courseId", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: limit },
                { $lookup: { from: "courses", localField: "_id", foreignField: "_id", as: "course" } },
                { $unwind: "$course" },
                { $project: { _id: 0, course: 1 } }
            ]);
        });
    }
}
exports.OrderRepository = OrderRepository;
