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
exports.PaymentController = void 0;
const stripe_1 = __importDefault(require("stripe"));
const uuid_1 = require("uuid");
const CourseOrderModel_1 = require("../../infrastructure/database/models/CourseOrderModel");
const SlotOrderModel_1 = require("../../infrastructure/database/models/SlotOrderModel");
const TutorRepository_1 = require("../../infrastructure/repositories/TutorRepository");
const TutorSlotRepository_1 = require("../../infrastructure/repositories/TutorSlotRepository");
const TutorUseCase_1 = require("../../application/useCases/tutor/TutorUseCase");
const RefundSlotOrderUseCase_1 = require("../../application/useCases/student/RefundSlotOrderUseCase");
const OrderRepository_1 = require("../../infrastructure/repositories/OrderRepository");
const HttpStatusEnum_1 = require("../../shared/enums/HttpStatusEnum");
const InitializeCourseProgressUseCase_1 = require("../../application/useCases/course/InitializeCourseProgressUseCase");
const ProgressRepository_1 = require("../../infrastructure/repositories/ProgressRepository");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-09-30.acacia'
});
class PaymentController {
    constructor() {
        this.createPaymentIntent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const slotDetails = req.body;
                const userId = req.userId;
                if (!userId) {
                    return res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({ error: 'User ID is required' });
                }
                const lineItems = [{
                        price_data: {
                            currency: 'inr',
                            product_data: {
                                name: slotDetails.subject
                            },
                            unit_amount: Math.round(slotDetails.price * 100)
                        },
                        quantity: 1
                    }];
                const session = yield stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: lineItems,
                    mode: 'payment',
                    success_url: `${process.env.CORSURL}/paymentsuccess`,
                    cancel_url: `${process.env.CORSURL}/paymentfailure`,
                    metadata: {
                        type: 'slot',
                        slotId: slotDetails._id.toString(),
                        userId: userId.toString(),
                    }
                });
                res.json({ id: session.id });
            }
            catch (error) {
                console.error('Error creating payment intent:', error);
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create payment intent' });
            }
        });
        this.createCoursePaymentIntent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const courseDetails = req.body;
                const userId = req.userId;
                if (!userId) {
                    return res.status(400).json({ error: 'User ID is required' });
                }
                const lineItems = [{
                        price_data: {
                            currency: 'inr',
                            product_data: {
                                name: courseDetails.title,
                                images: [courseDetails.thumbnailUrl]
                            },
                            unit_amount: Math.round(courseDetails.price * 100)
                        },
                        quantity: 1
                    }];
                const session = yield stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: lineItems,
                    mode: 'payment',
                    success_url: `${process.env.CORSURL}/paymentsuccess`,
                    cancel_url: `${process.env.CORSURL}/paymentfailure`,
                    metadata: {
                        type: 'course',
                        courseId: courseDetails._id.toString(),
                        userId: userId.toString(),
                        totalVideos: courseDetails.videos.length
                    }
                });
                res.json({ id: session.id });
            }
            catch (error) {
                console.error('Error creating payment intent:', error);
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create payment intent' });
            }
        });
        this.handlePaymentWebhook = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const endpointSecret = 'whsec_4574e983c6f66c38c2f99a2beca0ab24610ecd286a024fc41c208527dd66dca7';
                const sig = req.headers['stripe-signature'];
                if (!sig || !endpointSecret) {
                    return res.status(400).json({ error: 'Missing signature or endpoint secret' });
                }
                const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
                switch (event.type) {
                    case 'checkout.session.completed': {
                        const session = event.data.object;
                        if (!((_a = session.metadata) === null || _a === void 0 ? void 0 : _a.userId)) {
                            console.error('Missing required metadata in session:', session.id);
                            return res.status(HttpStatusEnum_1.HttpStatusEnum.BAD_REQUEST).json({ error: 'Missing required metadata' });
                        }
                        if (session.metadata.type === 'course') {
                            yield this.handleCoursePayment(session, 'Completed');
                        }
                        else if (session.metadata.type === 'slot') {
                            yield this.handleSlotPayment(session, 'Completed');
                        }
                        break;
                    }
                    case 'checkout.session.expired': {
                        const session = event.data.object;
                        if (!((_b = session.metadata) === null || _b === void 0 ? void 0 : _b.userId)) {
                            console.error('Missing required metadata in expired session:', session.id);
                            return res.status(HttpStatusEnum_1.HttpStatusEnum.BAD_REQUEST).json({ error: 'Missing required metadata' });
                        }
                        if (session.metadata.type === 'course') {
                            yield this.handleCoursePayment(session, 'Failed');
                        }
                        else if (session.metadata.type === 'slot') {
                            yield this.handleSlotPayment(session, 'Failed');
                        }
                        break;
                    }
                }
                res.json({ received: true });
            }
            catch (error) {
                console.error('Webhook error:', error);
                res.status(HttpStatusEnum_1.HttpStatusEnum.BAD_REQUEST).json({ error: 'Webhook error' });
            }
        });
        this.handleCoursePayment = (session, status) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const orderDetails = {
                courseId: (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.courseId,
                studentId: (_b = session.metadata) === null || _b === void 0 ? void 0 : _b.userId,
                paymentId: session.payment_intent,
                amount: session.amount_total ? session.amount_total / 100 : 0,
                paymentStatus: status,
                createdAt: new Date()
            };
            yield CourseOrderModel_1.CourseOrder.create(orderDetails);
            yield this._initializeCourseProgressUseCase.execute({ studentId: (_c = session.metadata) === null || _c === void 0 ? void 0 : _c.userId, courseId: (_d = session.metadata) === null || _d === void 0 ? void 0 : _d.courseId, totalVideos: Number((_e = session.metadata) === null || _e === void 0 ? void 0 : _e.totalVideos) });
        });
        this.handleSlotPayment = (session, status) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const orderDetails = {
                slotId: (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.slotId,
                studentId: (_b = session.metadata) === null || _b === void 0 ? void 0 : _b.userId,
                paymentId: session.payment_intent,
                amount: session.amount_total ? session.amount_total / 100 : 0,
                paymentStatus: status,
                createdAt: new Date()
            };
            yield SlotOrderModel_1.SlotOrder.create(orderDetails);
            if (status === 'Completed' && orderDetails.slotId && orderDetails.studentId) {
                const roomId = (0, uuid_1.v4)();
                const meetingLink = `${process.env.CORSURL}/room/${roomId}`;
                console.log("roomId from pay controller: ", roomId);
                console.log("meetingLink: ", meetingLink);
                yield this._tutorUseCase.UpdateSlotStatus(orderDetails.slotId, orderDetails.studentId, roomId, meetingLink);
            }
            else {
                console.error("Missing slotId or studentId in order details:", orderDetails);
            }
        });
        this.handleRefund = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const studentId = req.userId;
                const { slotOrderId } = req.params;
                const refundedOrder = yield this._refundSlotOrderUseCase.execute(slotOrderId, studentId);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({
                    message: 'Slot order refunded successfully',
                    order: refundedOrder
                });
            }
            catch (error) {
                console.error('Refund error:', error);
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to refund slot order' });
            }
        });
        this._tutorSlotRepo = new TutorSlotRepository_1.TutorSlotRepository();
        this._tutorRepo = new TutorRepository_1.TutorRepository();
        this._orderRepo = new OrderRepository_1.OrderRepository();
        this._progressRepo = new ProgressRepository_1.ProgressRepository();
        this._tutorUseCase = new TutorUseCase_1.TutorUseCase(this._tutorRepo, this._tutorSlotRepo);
        this._refundSlotOrderUseCase = new RefundSlotOrderUseCase_1.RefundSlotOrderUseCase(this._orderRepo);
        this._initializeCourseProgressUseCase = new InitializeCourseProgressUseCase_1.InitializeCourseProgressUseCase(this._progressRepo);
    }
}
exports.PaymentController = PaymentController;
