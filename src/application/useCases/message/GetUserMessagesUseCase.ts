import { IMessage } from "../../../domain/entities/IMessage";
import { IMessageRepository } from "../../../domain/interfaces/IMessageRepository";

export class GetUserMessagesUseCase {
  constructor(private _messageRepository: IMessageRepository) {}

  async execute(currentUserId: string, receiverId: string): Promise<IMessage[]> {
    return await this._messageRepository.getUserMessages(currentUserId, receiverId);
  }
}