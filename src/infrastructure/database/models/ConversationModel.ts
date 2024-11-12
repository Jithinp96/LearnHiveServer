import mongoose, { Document, Schema } from "mongoose";

interface Conversation extends Document {
    participants: []
    messages: []
}

const conversationSchema: Schema = new Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
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

export const ConversationModel = mongoose.model<Conversation>("Conversation", conversationSchema)