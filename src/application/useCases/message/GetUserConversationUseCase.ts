import { IConversation } from "../../../domain/entities/IConversation";
import { IConversationRepository } from "../../../domain/interfaces/IConversationRepository";

export class GetUserConversationsUseCase {
    constructor(private _conversationRepository: IConversationRepository) {}
  
    async execute(currentUserId: string, currentUserRole: string): Promise<{ _id: string; name: string, profileImage: string, role: string }[]> {
      return await this._conversationRepository.getUserConversations(currentUserId, currentUserRole);
    }
}