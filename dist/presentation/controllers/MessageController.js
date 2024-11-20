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
exports.MessageController = void 0;
const SendMessageUseCase_1 = require("../../application/useCases/message/SendMessageUseCase");
const GetMessageUseCase_1 = require("../../application/useCases/message/GetMessageUseCase");
const MessageRepository_1 = require("../../infrastructure/repositories/MessageRepository");
const ConversationRepository_1 = require("../../infrastructure/repositories/ConversationRepository");
const GetUserConversationUseCase_1 = require("../../application/useCases/message/GetUserConversationUseCase");
const GetAllConversationUseCase_1 = require("../../application/useCases/message/GetAllConversationUseCase");
const HttpStatusEnum_1 = require("../../shared/enums/HttpStatusEnum");
const GetUserMessagesUseCase_1 = require("../../application/useCases/message/GetUserMessagesUseCase");
class MessageController {
    constructor() {
        this.sendMessage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const senderId = req.userId;
            const senderRole = req.userRole;
            if (!senderId || !senderRole) {
                return res.status(HttpStatusEnum_1.HttpStatusEnum.BAD_REQUEST).json({ error: "Sender ID and role are required." });
            }
            try {
                console.log("req.body: ", req.body);
                const { receiverRole, receiverId, text } = req.body;
                const message = yield this._sendMessageUseCase.execute(senderId, senderRole, receiverId, receiverRole, text);
                // console.log("message: ", message);
                return res.status(HttpStatusEnum_1.HttpStatusEnum.CREATED).json(message);
            }
            catch (error) {
                return res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: "Error sending message" });
            }
        });
        this.getUserConversations = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Reached getUserConversations controller");
                const receiverId = req.params.receiverId;
                const currentUserId = req.userId;
                const currentUserRole = req.userRole;
                // console.log("currentUserId: ", currentUserId);
                // console.log("currentUserRole: ", currentUserRole);
                if (!currentUserId || !currentUserRole) {
                    return "User detials missing in token";
                }
                const conversations = yield this._getUserConversationUseCase.execute(currentUserId, currentUserRole);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({ conversations });
            }
            catch (error) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch conversations." });
            }
        });
        this.getMessages = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const conversationId = req.params.conversationId;
                const messages = yield this._getMessagesUseCase.execute(conversationId);
                res.status(200).json({ messages });
            }
            catch (error) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch messages." });
            }
        });
        this.getUserMessages = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const receiverId = req.query.receiverId;
                const currentUserId = req.userId;
                if (!currentUserId || !receiverId) {
                    return "User detials missing in token";
                }
                const messages = yield this._getUserMessagesUseCase.execute(currentUserId, receiverId);
                res.status(200).json({ messages });
            }
            catch (error) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch messages." });
            }
        });
        this.getAllConversations = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const conversations = yield this._getAllConversationUseCase.execute();
                return res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({ success: true, data: conversations });
            }
            catch (error) {
                console.error("Error fetching conversations:", error);
                return res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to fetch conversations" });
            }
        });
        const messageRepo = new MessageRepository_1.MessageRepository();
        const conversationRepo = new ConversationRepository_1.ConversationRepository();
        this._sendMessageUseCase = new SendMessageUseCase_1.SendMessageUseCase(messageRepo, conversationRepo);
        this._getMessagesUseCase = new GetMessageUseCase_1.GetMessagesUseCase(messageRepo);
        this._getUserMessagesUseCase = new GetUserMessagesUseCase_1.GetUserMessagesUseCase(messageRepo);
        this._getUserConversationUseCase = new GetUserConversationUseCase_1.GetUserConversationsUseCase(conversationRepo);
        this._getAllConversationUseCase = new GetAllConversationUseCase_1.GetAllConversationsUseCase(conversationRepo);
    }
}
exports.MessageController = MessageController;
