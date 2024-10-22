import mongoose, { Schema, Document } from 'mongoose';

interface SlotOrder extends Document {
    studentId: Schema.Types.ObjectId;
    tutorId: Schema.Types.ObjectId;
    paymentId: string;
    amount: number;
    paymentStatus: 'pending' | 'completed' | 'failed';
    sessionDate: Date;
    startTime: string;
    endTime: string;
    sessionStatus: 'scheduled' | 'completed' | 'cancelled';
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
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    sessionStatus: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    meetingLink: {
        type: String
    },
    notes: {
        type: String
    }
  }, { timestamps: true });

export const SlotOrder = mongoose.model<SlotOrder>('SlotOrder', SlotOrderSchema);

// import mongoose, { Schema, Document } from 'mongoose';

// export interface ISlotOrder extends Document {
//     slotId: mongoose.Types.ObjectId;
//     userId: mongoose.Types.ObjectId;
//     paymentId: string;
//     amount: number;
//     status: 'completed' | 'failed';
//     createdAt: Date;
//   }

// const slotOrderSchema = new mongoose.Schema({
//     slotId: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         required: true 
//     },
//     userId: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         required: true 
//     },
//     paymentId: { 
//         type: String, 
//         required: true 
//     },
//     amount: { 
//         type: Number, 
//         required: true 
//     },
//     status: { 
//         type: String, 
//         enum: ['completed', 'failed'], 
//         required: true 
//     },
//     createdAt: { 
//         type: Date, 
//         default: Date.now 
//     }
// });

// export const SlotOrderModel = mongoose.model('SlotOrder', slotOrderSchema);