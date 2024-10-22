import { timeStamp } from 'console';
import mongoose, { Schema, Document } from 'mongoose';

interface CartItem {
    courseId: string;
}

interface CartDocument extends Document {
    userId: string;
    items: CartItem[];
}

const cartSchema: Schema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        }
    }]
}, { timestamps: true });


export const CartModel = mongoose.model<CartDocument>('Cart', cartSchema);
