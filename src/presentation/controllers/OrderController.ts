import { Request, Response } from 'express';
import { OrderUseCase } from '../../application/useCases/student/OrderUseCase';
import { OrderRepository } from '../../infrastructure/repositories/OrderRepository';

interface AuthenticatedRequest extends Request {
    userId?: string; // Ensure userId is provided in the request
}

export class OrderController {
    private _orderUseCase: OrderUseCase

    constructor() {
        const orderRepository = new OrderRepository
        this._orderUseCase = new OrderUseCase(orderRepository)
    }

    public getCourseOrdersByStudent = async (req: AuthenticatedRequest, res: Response) => {
        const studentId = req.userId;

        if (!studentId) {
            return res.status(400).json({ message: "Student ID is required" });
        }

        try {
            const orders = await this._orderUseCase.getCourseOrders(studentId);
            console.log("Orders: ", orders);
            
            return res.status(200).json(orders);
        } catch (error) {
            console.error("Error fetching course orders:", error);
            return res.status(500).json({ message: "Failed to fetch course orders", error });
        }
    }

    public getSlotOrdersByStudent = async (req: AuthenticatedRequest, res: Response) => {
        const studentId = req.userId;

        if (!studentId) {
            return res.status(400).json({ message: "Student ID is required" });
        }

        try {
            const orders = await this._orderUseCase.getSlotOrders(studentId);
            
            return res.status(200).json(orders);
        } catch (error) {
            console.error("Error fetching slot orders:", error);
            return res.status(500).json({ message: "Failed to fetch slot orders", error});
        }
    }
}
