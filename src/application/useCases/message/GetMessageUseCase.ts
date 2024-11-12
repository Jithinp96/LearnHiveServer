import { IMessage } from "../../../domain/entities/IMessage";
import { IMessageRepository } from "../../../domain/interfaces/IMessageRepository";

export class GetMessagesUseCase {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(conversationId: string): Promise<IMessage[]> {
    return await this.messageRepository.getMessages(conversationId);
  }
}