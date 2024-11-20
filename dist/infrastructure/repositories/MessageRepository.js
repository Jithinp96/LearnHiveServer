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
exports.MessageRepository = void 0;
const MessageModel_1 = require("../database/models/MessageModel");
const ConversationModel_1 = require("../database/models/ConversationModel");
class MessageRepository {
    save(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const newMessage = new MessageModel_1.MessageModel(message);
            const savedMessage = yield newMessage.save();
            return savedMessage.toObject();
        });
    }
    getMessages(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversation = yield ConversationModel_1.ConversationModel.findById(conversationId)
                .populate('messages')
                .exec();
            if (!conversation) {
                throw new Error("Conversation not found");
            }
            return conversation.messages || [];
        });
    }
    getUserMessages(currentUserId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the conversation with both participants
                const conversation = yield ConversationModel_1.ConversationModel.findOne({
                    participants: { $all: [currentUserId, receiverId] }
                })
                    .populate('messages')
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
            }
            catch (error) {
                console.error("Error fetching user messages: ", error);
                throw new Error("Could not fetch messages");
            }
        });
    }
}
exports.MessageRepository = MessageRepository;
