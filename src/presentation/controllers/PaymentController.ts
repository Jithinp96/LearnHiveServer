import { Request, Response } from 'express';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';

import { CourseOrder } from '../../infrastructure/database/models/CourseOrderModel';
import { SlotOrder } from '../../infrastructure/database/models/SlotOrderModel';
import { TutorRepository } from '../../infrastructure/repositories/TutorRepository';
import { TutorSlotRepository } from '../../infrastructure/repositories/TutorSlotRepository';
import { TutorUseCase } from '../../application/useCases/tutor/TutorUseCase';
import { RefundSlotOrderUseCase } from '../../application/useCases/student/RefundSlotOrderUseCase';
import { OrderRepository } from '../../infrastructure/repositories/OrderRepository';
import { HttpStatusEnum } from '../../shared/enums/HttpStatusEnum';
import { InitializeCourseProgressUseCase } from '../../application/useCases/course/InitializeCourseProgressUseCase';
import { ProgressRepository } from '../../infrastructure/repositories/ProgressRepository';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-09-30.acacia' 
});

export class PaymentController {
  private _tutorSlotRepo: TutorSlotRepository;
  private _tutorRepo: TutorRepository;
  private _orderRepo: OrderRepository;
  private _progressRepo: ProgressRepository

  private _tutorUseCase: TutorUseCase;
  private _refundSlotOrderUseCase: RefundSlotOrderUseCase;
  private _initializeCourseProgressUseCase: InitializeCourseProgressUseCase;

  constructor() {
    this._tutorSlotRepo = new TutorSlotRepository();
    this._tutorRepo = new TutorRepository();
    this._orderRepo = new OrderRepository()
    this._progressRepo = new ProgressRepository()

    this._tutorUseCase = new TutorUseCase(this._tutorRepo, this._tutorSlotRepo);
    this._refundSlotOrderUseCase = new RefundSlotOrderUseCase(this._orderRepo);
    this._initializeCourseProgressUseCase = new InitializeCourseProgressUseCase(this._progressRepo)
  }

  public createPaymentIntent = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const slotDetails = req.body;
      const userId = req.userId;

      if (!userId) {
        return res.status(HttpStatusEnum.UNAUTHORIZED).json({ error: 'User ID is required' });
      }

      const lineItems = [{
          price_data: {
              currency: 'inr',
              product_data: {
                  name: slotDetails.subject
              },
              unit_amount: Math.round(slotDetails.price*100)
          },
          quantity: 1
      }]

      const session = await stripe.checkout.sessions.create({
          payment_method_types:['card'],
          line_items: lineItems,
          mode:'payment',
          success_url:`${process.env.CORSURL}/paymentsuccess`,
          cancel_url:`${process.env.CORSURL}/paymentfailure`,
          metadata: {
            type: 'slot',
            slotId: slotDetails._id.toString(),
            userId: userId.toString(),
          }
      })
      
      res.json({id:session.id})
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create payment intent' });
    }
  }

  public createCoursePaymentIntent = async(req: AuthenticatedRequest, res: Response) => {
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

      const session = await stripe.checkout.sessions.create({
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

      res.json({id:session.id})
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create payment intent' });
    }
  }

  public handlePaymentWebhook = async(req: Request, res: Response) => {
    try {
      const endpointSecret = 'whsec_4574e983c6f66c38c2f99a2beca0ab24610ecd286a024fc41c208527dd66dca7';
      const sig = req.headers['stripe-signature'];

      if (!sig || !endpointSecret) {
        return res.status(400).json({ error: 'Missing signature or endpoint secret' });
      }

      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret
      );

      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          
          if (!session.metadata?.userId) {
            console.error('Missing required metadata in session:', session.id);
            return res.status(HttpStatusEnum.BAD_REQUEST).json({ error: 'Missing required metadata' });
          }

          if (session.metadata.type === 'course') {
            await this.handleCoursePayment(session, 'Completed');
          } else if (session.metadata.type === 'slot') {
            await this.handleSlotPayment(session, 'Completed');
          }
          break;
        }
        
        case 'checkout.session.expired': {
          const session = event.data.object as Stripe.Checkout.Session;
          
          if (!session.metadata?.userId) {
            console.error('Missing required metadata in expired session:', session.id);
            return res.status(HttpStatusEnum.BAD_REQUEST).json({ error: 'Missing required metadata' });
          }

          if (session.metadata.type === 'course') {
            await this.handleCoursePayment(session, 'Failed');
          } else if (session.metadata.type === 'slot') {
            await this.handleSlotPayment(session, 'Failed');
          }
          break;
        }
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(HttpStatusEnum.BAD_REQUEST).json({ error: 'Webhook error' });
    }
  }

  private handleCoursePayment = async (session: Stripe.Checkout.Session, status: string) => {
    const orderDetails = {
      courseId: session.metadata?.courseId,
      studentId: session.metadata?.userId,
      paymentId: session.payment_intent as string,
      amount: session.amount_total ? session.amount_total / 100 : 0,
      paymentStatus: status,
      createdAt: new Date()
    };

    await CourseOrder.create(orderDetails);
    await this._initializeCourseProgressUseCase.execute({ studentId: session.metadata?.userId, courseId: session.metadata?.courseId, totalVideos:Number(session.metadata?.totalVideos) });
  }

  private handleSlotPayment = async (session: Stripe.Checkout.Session, status: 'Completed' | 'Failed') => {
    const orderDetails = {
      slotId: session.metadata?.slotId,
      studentId: session.metadata?.userId,
      paymentId: session.payment_intent as string,
      amount: session.amount_total ? session.amount_total / 100 : 0,
      paymentStatus: status,
      createdAt: new Date()
    };

    await SlotOrder.create(orderDetails);

    if (status === 'Completed' && orderDetails.slotId && orderDetails.studentId) {
      const roomId = uuidv4();
      const meetingLink = `${process.env.CORSURL}/room/${roomId}`;
      console.log("roomId from pay controller: ", roomId);
      console.log("meetingLink: ", meetingLink);
      
      await this._tutorUseCase.UpdateSlotStatus(orderDetails.slotId, orderDetails.studentId, roomId, meetingLink);
    } else {
      console.error("Missing slotId or studentId in order details:", orderDetails);
    }
  }

  public handleRefund = async (req: AuthenticatedRequest, res: Response) => {
    
    try {
      const studentId = req.userId as string;
      const { slotOrderId } = req.params;
      
      const refundedOrder = await this._refundSlotOrderUseCase.execute(slotOrderId, studentId);
      
      res.status(HttpStatusEnum.OK).json({
        message: 'Slot order refunded successfully',
        order: refundedOrder
      });
    } catch (error) {
      console.error('Refund error:', error);
      res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to refund slot order' });
    }
  }
}