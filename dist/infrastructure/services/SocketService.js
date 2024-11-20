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
exports.SocketService = void 0;
const SendMessageUseCase_1 = require("../../application/useCases/message/SendMessageUseCase");
const MessageRepository_1 = require("../repositories/MessageRepository");
const ConversationRepository_1 = require("../repositories/ConversationRepository");
const GetMessageUseCase_1 = require("../../application/useCases/message/GetMessageUseCase");
const GetUserConversationUseCase_1 = require("../../application/useCases/message/GetUserConversationUseCase");
class SocketService {
    constructor(options) {
        this.io = options.io;
        // Initialize repositories and use cases
        const messageRepo = new MessageRepository_1.MessageRepository();
        const conversationRepo = new ConversationRepository_1.ConversationRepository();
        this.sendMessageUseCase = new SendMessageUseCase_1.SendMessageUseCase(messageRepo, conversationRepo);
        this.getMessagesUseCase = new GetMessageUseCase_1.GetMessagesUseCase(messageRepo);
        this.getUserConversationsUseCase = new GetUserConversationUseCase_1.GetUserConversationsUseCase(conversationRepo);
        this.registerSocketEvents();
    }
    registerSocketEvents() {
        const users = [];
        const findUserById = (userId) => {
            return users.find(user => user.userId === userId);
        };
        this.io.on("connection", (socket) => {
            console.log("A user connected:", socket.id);
            socket.on("joinRoom", (_a) => __awaiter(this, [_a], void 0, function* ({ userId }) {
                // }
                try {
                    console.log("userId", userId);
                    const existingUser = users.find(user => user.userId === userId);
                    if (!existingUser) {
                        users.push({ userId, socketId: socket.id });
                        console.log(`User ${userId} joined with socket ID: ${socket.id}`);
                    }
                    else {
                        console.log(`User ${userId} is already connected.`);
                    }
                    socket.join(userId);
                }
                catch (error) {
                    console.error("Error in socket join room: ", error);
                }
            }));
            // Handle sending a message
            socket.on("sendMessage", (_a) => __awaiter(this, [_a], void 0, function* ({ senderId, senderRole, receiverId, receiverRole, text }) {
                try {
                    const message = {
                        senderId,
                        senderRole,
                        receiverId,
                        receiverRole,
                        text
                    };
                    if (message) {
                        // Determine the room ID (could be a conversation ID)
                        const conversation = yield this.sendMessageUseCase['_conversationRepository'].findByParticipants(senderId, receiverId);
                        const roomId = conversation === null || conversation === void 0 ? void 0 : conversation._id;
                        const user = findUserById(receiverId);
                        if (user) {
                            this.io.to(user.socketId).emit("receiveMessage", message);
                        }
                    }
                }
                catch (error) {
                    console.error("Error sending message via socket:", error);
                    socket.emit("error", { message: "Failed to send message" });
                }
            }));
            // Handle disconnect
            socket.on("disconnect", () => {
                console.log("A user disconnected:", socket.id);
                const index = users.findIndex(user => user.socketId === socket.id);
                if (index !== -1) {
                    const disconnectedUser = users[index];
                    users.splice(index, 1); // Remove the user from the array
                    console.log(`User ${disconnectedUser.userId} with socket ID ${socket.id} removed from users list.`);
                }
            });
        });
    }
}
exports.SocketService = SocketService;
