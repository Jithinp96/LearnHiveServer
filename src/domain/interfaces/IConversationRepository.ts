import mongoose from "mongoose";
import { IConversation } from "../entities/IConversation";

export interface IConversationRepository {
    findByParticipants(participant1: string, participant2: string): Promise<mongoose.Document | null>;
    createConversation(participants: string[]): Promise<mongoose.Document>;
    addMessageToConversation(conversationId: string, messageId: string): Promise<mongoose.Document | null>;
    getUserConversations(currentUserId: string, currentUserRole: string): Promise<{ _id: string; name: string, profileImage: string, role: string }[]>;
    getAllConversations(): Promise<IConversation[]>;
}