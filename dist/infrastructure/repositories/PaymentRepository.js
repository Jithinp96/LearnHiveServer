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
exports.PaymentRepository = void 0;
const CourseOrderModel_1 = require("../database/models/CourseOrderModel");
const SlotOrderModel_1 = require("../database/models/SlotOrderModel");
class PaymentRepository {
    saveOrderDetails(order) {
        return __awaiter(this, void 0, void 0, function* () {
            if (order.courseId) {
                return yield CourseOrderModel_1.CourseOrder.create(order);
            }
            else if (order.slotId) {
                return yield SlotOrderModel_1.SlotOrder.create(order);
            }
        });
    }
    updateOrderStatus(orderId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield SlotOrderModel_1.SlotOrder.findByIdAndUpdate(orderId, { status }, { new: true });
        });
    }
    getOrderById(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield SlotOrderModel_1.SlotOrder.findById(orderId);
        });
    }
}
exports.PaymentRepository = PaymentRepository;
