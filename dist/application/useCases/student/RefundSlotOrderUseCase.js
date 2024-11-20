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
exports.RefundSlotOrderUseCase = void 0;
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-09-30.acacia'
});
class RefundSlotOrderUseCase {
    constructor(orderRepo) {
        this._orderRepo = orderRepo;
    }
    execute(slotOrderId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const slotOrder = yield this._orderRepo.getSlotOrderById(slotOrderId);
            if (!slotOrder) {
                throw new Error('Slot order not found');
            }
            if (slotOrder.paymentStatus !== 'Completed') {
                throw new Error('Refund is allowed only for completed orders');
            }
            const refund = yield stripe.refunds.create({
                payment_intent: slotOrder.paymentId,
                amount: Math.round(slotOrder.amount * 100),
            });
            slotOrder.sessionStatus = 'Cancelled';
            slotOrder.refundId = refund.id;
            return this._orderRepo.updateSlotOrder(slotOrder);
        });
    }
}
exports.RefundSlotOrderUseCase = RefundSlotOrderUseCase;
