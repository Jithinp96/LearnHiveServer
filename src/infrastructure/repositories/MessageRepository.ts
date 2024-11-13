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

    async getUserMessages(currentUserId: string, receiverId: string): Promise<IMessage[]> {
          try {
              // Find the conversation with both participants
                const conversation = await ConversationModel.findOne({
                    participants: { $all: [currentUserId, receiverId] }
                })
                .populate<{ messages: IMessage[] }>('messages')
                .exec();
      
              // If no conversation found, return an empty array
              if (!conversation) {
                throw new Error("Conversation not found");
            }
    
            return conversation.messages || [];
      
              // Use the conversation ID to fetch messages
            //   const messages = await MessageModel.find({ conversationId: conversation._id })
            //       .sort({ createdAt: 1 })  // Optional: Sort messages by creation date
            //       .lean<IMessage[]>()
            //       .exec();
      
            //   return conversation;
          } catch (error) {
              console.error("Error fetching user messages: ", error);
              throw new Error("Could not fetch messages");
          }
      }
      

    // async findByConversationId(conversationId: string): Promise<IMessage[]> {
    //     return await MessageModel.find({ conversationId }).exec();
    // }
}