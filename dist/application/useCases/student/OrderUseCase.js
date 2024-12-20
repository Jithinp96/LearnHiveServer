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
exports.OrderUseCase = void 0;
class OrderUseCase {
    constructor(_orderRepo) {
        this._orderRepo = _orderRepo;
    }
    getCourseOrders(studentId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._orderRepo.getCourseOrderByStudentId(studentId, { page, limit });
        });
    }
    // async getSlotOrders(studentId: string): Promise<ISlotOrder[]> {
    //     return this._orderRepo.getSlotOrderByStudentId(studentId)
    // }
    getSlotOrders(studentId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._orderRepo.getSlotOrderByStudentId(studentId, { page, limit });
        });
    }
    updateCompletionStatus(studentId, courseId, completionStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._orderRepo.updateCompletionStatus(studentId, courseId, completionStatus);
        });
    }
}
exports.OrderUseCase = OrderUseCase;
