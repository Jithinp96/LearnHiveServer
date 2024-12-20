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
exports.OrderController = void 0;
const OrderUseCase_1 = require("../../application/useCases/student/OrderUseCase");
const OrderRepository_1 = require("../../infrastructure/repositories/OrderRepository");
const HttpStatusEnum_1 = require("../../shared/enums/HttpStatusEnum");
class OrderController {
    constructor() {
        // public getCourseOrdersByStudent = async (req: AuthenticatedRequest, res: Response) => {
        //     const studentId = req.userId;
        //     if (!studentId) {
        //         return res.status(HttpStatusEnum.BAD_REQUEST).json({ message: "Student ID is required" });
        //     }
        //     try {
        //         const orders = await this._orderUseCase.getCourseOrders(studentId);
        //         return res.status(HttpStatusEnum.OK).json(orders);
        //     } catch (error) {
        //         console.error("Error fetching course orders:", error);
        //         return res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch course orders", error });
        //     }
        // }
        this.getCourseOrdersByStudent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const studentId = req.userId;
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 6;
            if (!studentId) {
                return res.status(HttpStatusEnum_1.HttpStatusEnum.BAD_REQUEST).json({ message: "Student ID is required" });
            }
            try {
                const { courseOrders, totalOrders, totalPages, currentPage } = yield this._orderUseCase.getCourseOrders(studentId, page, limit);
                return res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({
                    courseOrders,
                    totalOrders,
                    totalPages,
                    currentPage
                });
            }
            catch (error) {
                console.error("Error fetching course orders:", error);
                return res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({
                    message: "Failed to fetch course orders",
                    error
                });
            }
        });
        this.getSlotOrdersByStudent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const studentId = req.userId;
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 5;
            if (!studentId) {
                return res.status(HttpStatusEnum_1.HttpStatusEnum.BAD_REQUEST).json({
                    message: "Student ID is required"
                });
            }
            try {
                const { slotOrders, totalOrders, totalPages, currentPage } = yield this._orderUseCase.getSlotOrders(studentId, page, limit);
                return res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({
                    slotOrders,
                    totalOrders,
                    totalPages,
                    currentPage
                });
            }
            catch (error) {
                console.error("Error fetching slot orders:", error);
                return res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({
                    message: "Failed to fetch slot orders",
                    error
                });
            }
        });
        const orderRepository = new OrderRepository_1.OrderRepository;
        this._orderUseCase = new OrderUseCase_1.OrderUseCase(orderRepository);
    }
}
exports.OrderController = OrderController;
// public getSlotOrdersByStudent = async (req: AuthenticatedRequest, res: Response) => {
//     const studentId = req.userId;
//     if (!studentId) {
//         return res.status(HttpStatusEnum.BAD_REQUEST).json({ message: "Student ID is required" });
//     }
//     try {
//         const orders = await this._orderUseCase.getSlotOrders(studentId);
//         return res.status(HttpStatusEnum.OK).json(orders);
//     } catch (error) {
//         console.error("Error fetching slot orders:", error);
//         return res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch slot orders", error});
//     }
// }
