import { IMessage } from "../entities/IMessage";

export interface IMessageRepository {
    save(message: IMessage): Promise<IMessage>;
    getMessages(conversationId: string): Promise<IMessage[]>;
    getUserMessages(currentUserId: string, receiverId: string): Promise<IMessage[]>;
    // findByConversationId(conversationId: string): Promise<IMessage[]>;
}