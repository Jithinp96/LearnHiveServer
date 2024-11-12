import { IMessage } from "../entities/IMessage";

export interface IMessageRepository {
    save(message: IMessage): Promise<IMessage>;
    getMessages(conversationId: string): Promise<IMessage[]>;
    // findByConversationId(conversationId: string): Promise<IMessage[]>;
}