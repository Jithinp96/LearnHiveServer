import { ObjectId } from "mongodb";
import { Request, Response } from "express";
// import Stripe from "stripe";

import { CartUseCase } from "../../application/useCases/student/CartUseCase";
import { CartRepository } from "../../infrastructure/repositories/CartRepository";
import Stripe from "stripe";

interface AuthenticatedRequest extends Request {
    userId?: string;
}

export class CartController {
    private _cartUseCase: CartUseCase

    constructor() {
        const cartRepository = new CartRepository()
        this._cartUseCase = new CartUseCase(cartRepository)
    }

    public addCourseToCart = async(req: AuthenticatedRequest, res: Response): Promise<void> => {
        const { courseId } = req.body
        const studentId = req.userId;
        
        if (!studentId) {
            res.status(401).json({ message: 'Unauthorized: Student ID is required.' });
            return;
        }

        try {
            const updatedCart = await this._cartUseCase.addToCart(studentId, courseId);
            console.log(updatedCart);
            
            res.status(200).json(updatedCart);
        } catch (error) {
            res.status(500).json({ message: 'Failed to add course to cart' });
        }
    }

    public fetchCart = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const studentId = req.userId;
            if (!studentId) {
                res.status(401).json({ message: 'Unauthorized: Student ID is required.' });
                return;
            }

            const cart = await this._cartUseCase.fetchCart(studentId)
            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json({ message: 'Failed to load cart' });
        }
    }

    public deleteFromCart = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const studentId = req.userId;
            const { courseId } = req.params;
            
            if (!studentId) {
                res.status(401).json({ message: 'Unauthorized: Student ID is required.' });
                return;
            }

            const cart = await this._cartUseCase.deleteFromCart(studentId, courseId)
            res.status(200).json(cart)
        } catch (error) {
            res.status(500).json({ message: 'Failed to remove from cart' });
        }
    }

    public payment = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

            const { cartDetails } = req.body
            const studentId = req.userId
            
            const line_items = cartDetails.map((item: any) => ({
                price_data: {
                  currency: 'inr',
                  product_data: {
                    name: item.courseId.title,
                  },
                  unit_amount: item.courseId.price * 100,
                },
                quantity: 1,
            }));
        
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: line_items,
                mode: 'payment',
                success_url:`${process.env.CORSURL}/paymentsuccess`,
                cancel_url:`${process.env.CORSURL}/paymentfailure`
            });
            
            res.json({ session });
        } catch (error) {
            console.error("Unable to process payment: ", error);
        }
    }
}