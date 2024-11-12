import { IMessageRepository } from "../../../domain/interfaces/IMessageRepository";
import { IConversationRepository } from "../../../domain/interfaces/IConversationRepository"; // Import conversation repository interface
import { IMessage } from "../../../domain/entities/IMessage";

export class SendMessageUseCase {
    constructor(
        private _messageRepository: IMessageRepository,
        private _conversationRepository: IConversationRepository // Inject conversation repository
    ) {}

    async execute(senderId: string, senderRole: string, receiverId: string, receiverRole: string, text: string): Promise<IMessage | null> {
        try {
            let conversation = await this._conversationRepository.findByParticipants(senderId, receiverId);
            
            if (!conversation) {
                conversation = await this._conversationRepository.createConversation([senderId, receiverId]);
            }

            const messageData: IMessage = {
                senderId,
                receiverId,
                message: text,
                status: 'sent'
            };
            const savedMessage = await this._messageRepository.save(messageData);

            await this._conversationRepository.addMessageToConversation(
                String(conversation._id), 
                String(savedMessage._id)
            );

            return savedMessage;
        } catch (error) {
            console.error("Error in SendMessageUseCase:", error);
            throw new Error("Failed to send message");
        }
    }
}
