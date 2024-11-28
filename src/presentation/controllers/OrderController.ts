import { Request, Response } from 'express';
import { OrderUseCase } from '../../application/useCases/student/OrderUseCase';
import { OrderRepository } from '../../infrastructure/repositories/OrderRepository';
import { HttpStatusEnum } from '../../shared/enums/HttpStatusEnum';

interface AuthenticatedRequest extends Request {
    userId?: string;
}

export class OrderController {
    private _orderUseCase: OrderUseCase

    constructor() {
        const orderRepository = new OrderRepository
        this._orderUseCase = new OrderUseCase(orderRepository)
    }

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

    public getCourseOrdersByStudent = async (req: AuthenticatedRequest, res: Response) => {
        const studentId = req.userId;
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
    
        if (!studentId) {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({ message: "Student ID is required" });
        }
    
        try {
            const { 
                courseOrders, 
                totalOrders, 
                totalPages, 
                currentPage 
            } = await this._orderUseCase.getCourseOrders(
                studentId, 
                page, 
                limit
            );
            
            return res.status(HttpStatusEnum.OK).json({
                courseOrders,
                totalOrders,
                totalPages,
                currentPage
            });
        } catch (error) {
            console.error("Error fetching course orders:", error);
            return res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ 
                message: "Failed to fetch course orders", 
                error 
            });
        }
    }

    
    public getSlotOrdersByStudent = async (req: AuthenticatedRequest, res: Response) => {
        const studentId = req.userId;
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
        
        if (!studentId) {
          return res.status(HttpStatusEnum.BAD_REQUEST).json({ 
            message: "Student ID is required" 
        });
    }
    
    try {
        const { 
            slotOrders, 
            totalOrders, 
            totalPages, 
            currentPage 
        } = await this._orderUseCase.getSlotOrders(studentId, page, limit);
          
          return res.status(HttpStatusEnum.OK).json({
              slotOrders,
              totalOrders,
              totalPages,
              currentPage
            });
        } catch (error) {
            console.error("Error fetching slot orders:", error);
            return res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ 
                message: "Failed to fetch slot orders", 
                error
            });
        }
    }
}

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