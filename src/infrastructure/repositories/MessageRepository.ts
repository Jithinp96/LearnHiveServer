import { IMessageRepository } from "../../domain/interfaces/IMessageRepository";
import { MessageModel } from "../database/models/MessageModel";
import { IMessage } from "../../domain/entities/IMessage";
import { ConversationModel } from "../database/models/ConversationModel";

export class MessageRepository implements IMessageRepository {
    async save(message: IMessage): Promise<IMessage> {
        const newMessage = new MessageModel(message);
        const savedMessage = await newMessage.save();
        return savedMessage.toObject() as IMessage;
    }

    async getMessages(conversationId: string): Promise<IMessage[]> {
        const conversation = await ConversationModel.findById(conversationId)
            .populate<{ messages: IMessage[] }>('messages')
            .exec();

        if (!conversation) {
            throw new Error("Conversation not found");
        }

        return conversation.messages || [];
    }

    // async findByConversationId(conversationId: string): Promise<IMessage[]> {
    //     return await MessageModel.find({ conversationId }).exec();
    // }
}