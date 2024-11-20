"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageUseCase = void 0;
class SendMessageUseCase {
    constructor(_messageRepository, _conversationRepository // Inject conversation repository
    ) {
        this._messageRepository = _messageRepository;
        this._conversationRepository = _conversationRepository;
    }
    execute(senderId, senderRole, receiverId, receiverRole, text) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let conversation = yield this._conversationRepository.findByParticipants(senderId, receiverId);
                if (!conversation) {
                    conversation = yield this._conversationRepository.createConversation([senderId, receiverId]);
                }
                const messageData = {
                    senderId,
                    receiverId,
                    message: text,
                    status: 'sent'
                };
                const savedMessage = yield this._messageRepository.save(messageData);
                yield this._conversationRepository.addMessageToConversation(String(conversation._id), String(savedMessage._id));
                return savedMessage;
            }
            catch (error) {
                console.error("Error in SendMessageUseCase:", error);
                throw new Error("Failed to send message");
            }
        });
    }
}
exports.SendMessageUseCase = SendMessageUseCase;
