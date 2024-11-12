import { IConversation } from "../../../domain/entities/IConversation";
import { IConversationRepository } from "../../../domain/interfaces/IConversationRepository";

export class GetAllConversationsUseCase {
    constructor(private conversationRepository: IConversationRepository) {}

    async execute(): Promise<IConversation[]> {
        return await this.conversationRepository.getAllConversations();
    }
}
