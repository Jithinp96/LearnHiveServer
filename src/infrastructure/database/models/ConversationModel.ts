import mongoose, { Document, Schema } from "mongoose";

interface Conversation extends Document {
    participants: []
    messages: []
}

const conversationSchema: Schema = new Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        } 
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            default: []
        }
    ]
}, {timestamps: true})

export const Conversation = mongoose.model<Conversation>("Conversation", conversationSchema)