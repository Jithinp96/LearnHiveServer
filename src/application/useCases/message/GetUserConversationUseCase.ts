import { IConversation } from "../../../domain/entities/IConversation";
import { IConversationRepository } from "../../../domain/interfaces/IConversationRepository";

export class GetUserConversationsUseCase {
    constructor(private _conversationRepository: IConversationRepository) {}
  
    async execute(receiverId: string): Promise<IConversation[]> {
      return await this._conversationRepository.getConversations(receiverId);
    }
  }