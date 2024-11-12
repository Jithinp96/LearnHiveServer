import { IConversation } from "../../domain/entities/IConversation";
import { IConversationRepository } from "../../domain/interfaces/IConversationRepository";
import { ConversationModel } from "../database/models/ConversationModel";
import mongoose from "mongoose";

export class ConversationRepository implements IConversationRepository {
    async findByParticipants(participant1: string, participant2: string) {
        return await ConversationModel.findOne({
            participants: { $all: [participant1, participant2] }
        }).exec();
    }

    async createConversation(participants: string[]): Promise<mongoose.Document> {
        const newConversation = new ConversationModel({ participants });
        return await newConversation.save();
    }

    async addMessageToConversation(conversationId: string, messageId: string) {
        return await ConversationModel.findByIdAndUpdate(
            conversationId,
            { $push: { messages: messageId } },
            { new: true }
        ).exec();
    }

    async getConversations(receiverId: string): Promise<IConversation[]> {
        return await ConversationModel.find({ participants: receiverId })
            .populate("messages")
            .lean<IConversation[]>()
            .exec();
    }

    async getAllConversations(): Promise<IConversation[]> {
        return await ConversationModel.find({})
            .populate("messages")
            .lean<IConversation[]>()
            .exec();
    }
}
