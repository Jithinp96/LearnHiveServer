import { log } from 'console';
import { Request, Response } from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export class PaymentController {
  async createPaymentIntent(req: Request, res: Response) {
    try {
        const slotDetails = req.body;
        
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
            cancel_url:`${process.env.CORSURL}/paymentfailure`
        })
        
        res.json({id:session.id})
      } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Failed to create payment intent' });
      }
  }

  async createCoursePaymentIntent(req: Request, res: Response) {
    try {
        const courseDetails = req.body;
        
        const lineItems = [{
            price_data: {
                currency: 'inr',
                product_data: {
                    name: courseDetails.title,
                    images: [courseDetails.thumbnailUrl]
                },
                unit_amount: Math.round(courseDetails.price*100)
            },
            quantity: 1
        }]

        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            line_items: lineItems,
            mode:'payment',
            success_url:`${process.env.CORSURL}/paymentsuccess`,
            cancel_url:`${process.env.CORSURL}/paymentfailure`
        })
        
        res.json({id:session.id})
      } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Failed to create payment intent' });
      }
  }
}