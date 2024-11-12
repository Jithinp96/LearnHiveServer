import mongoose from "mongoose";
import { IConversation } from "../entities/IConversation";

export interface IConversationRepository {
    findByParticipants(participant1: string, participant2: string): Promise<mongoose.Document | null>;
    createConversation(participants: string[]): Promise<mongoose.Document>;
    addMessageToConversation(conversationId: string, messageId: string): Promise<mongoose.Document | null>;
    getConversations(userId: string): Promise<IConversation[]>;
    getAllConversations(): Promise<IConversation[]>;
}