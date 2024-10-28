import mongoose, { Schema, Document } from 'mongoose';

interface SlotOrder extends Document {
    studentId: string;
    tutorId: string;
    paymentId: string;
    amount: number;
    paymentStatus: 'Pending' | 'Completed' | 'Failed';
    sessionStatus: 'Scheduled' | 'Completed' | 'Cancelled';
    meetingLink?: string;
    notes?: string;
}

const SlotOrderSchema: Schema = new Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    slotId: {
        type: Schema.Types.ObjectId,
        ref: 'TutorSlot',
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
    sessionStatus: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled'],
        default: 'Scheduled'
    },
    meetingLink: {
        type: String
    },
    notes: {
        type: String
    }
  }, { timestamps: true });

export const SlotOrder = mongoose.model<SlotOrder>('SlotOrder', SlotOrderSchema);