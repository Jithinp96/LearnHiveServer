import { Request, Response } from 'express';
import Stripe from 'stripe';
import { CourseOrder } from '../../infrastructure/database/models/CourseOrderModel';
import { SlotOrder } from '../../infrastructure/database/models/SlotOrderModel';
import { TutorRepository } from '../../infrastructure/repositories/TutorRepository';
import { TutorSlotRepository } from '../../infrastructure/repositories/TutorSlotRepository';
import { TutorUseCase } from '../../application/useCases/tutor/TutorUseCase';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-09-30.acacia' 
});

export class PaymentController {
  private _tutorSlotRepo: TutorSlotRepository;
  private _tutorRepo: TutorRepository;
  private _tutorUseCase: TutorUseCase;

  constructor() {
    this._tutorSlotRepo = new TutorSlotRepository();
    this._tutorRepo = new TutorRepository();
    this._tutorUseCase = new TutorUseCase(this._tutorRepo, this._tutorSlotRepo);
  }

  public createPaymentIntent = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const slotDetails = req.body;
      const userId = req.userId;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
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
      res.status(500).json({ error: 'Failed to create payment intent' });
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
        }
      });

      res.json({id:session.id})
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ error: 'Failed to create payment intent' });
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
            return res.status(400).json({ error: 'Missing required metadata' });
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
            return res.status(400).json({ error: 'Missing required metadata' });
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
      res.status(400).json({ error: 'Webhook error' });
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

    // if (status === 'Completed') {
      
    // }
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
      await this._tutorUseCase.UpdateSlotStatus(orderDetails.slotId, orderDetails.studentId);
    } else {
      console.error("Missing slotId or studentId in order details:", orderDetails);
    }
  }
}