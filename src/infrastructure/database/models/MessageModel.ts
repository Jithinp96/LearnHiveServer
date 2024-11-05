import mongoose, { Document, Schema } from "mongoose";

interface Message extends Document {
    senderId: string,
    receiverId: string,
    message: string,
    status?: 'sent' | 'delivered' | 'read';
}

const messageSchema: Schema = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    },
}, {timestamps: true});

export const Message = mongoose.model<Message>("Message", messageSchema)