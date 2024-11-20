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
    getCourseOrderByStudentId(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return CourseOrderModel_1.CourseOrder.find({ studentId })
                .populate({
                path: "courseId",
                select: "title category thumbnailUrl level duration reviews",
                populate: {
                    path: 'category',
                    select: 'name',
                }
            })
                .then((orders) => orders);
        });
    }
    getSlotOrderByStudentId(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return SlotOrderModel_1.SlotOrder.find({ studentId })
                .populate({
                path: "slotId",
                select: "subject level date startTime endTime meetingLink",
            })
                .then((slots) => slots);
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
}
exports.OrderRepository = OrderRepository;
