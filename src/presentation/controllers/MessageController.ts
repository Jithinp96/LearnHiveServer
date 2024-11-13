import { Request, Response } from "express";
import { SendMessageUseCase } from "../../application/useCases/message/SendMessageUseCase";
import { GetMessagesUseCase } from "../../application/useCases/message/GetMessageUseCase";
import { MessageRepository } from "../../infrastructure/repositories/MessageRepository";
import { ConversationRepository } from "../../infrastructure/repositories/ConversationRepository";
import { UserRole } from "../../shared/enums/UserRoleEnum";
import { GetUserConversationsUseCase } from "../../application/useCases/message/GetUserConversationUseCase";
import { GetAllConversationsUseCase } from "../../application/useCases/message/GetAllConversationUseCase";
import { HttpStatusEnum } from "../../shared/enums/HttpStatusEnum";
import { GetUserMessagesUseCase } from "../../application/useCases/message/GetUserMessagesUseCase";

interface AuthenticatedRequest extends Request {
    userId?: string;
    userRole?: UserRole
}

export class MessageController {
    private _sendMessageUseCase: SendMessageUseCase
    private _getMessagesUseCase: GetMessagesUseCase
    private _getUserMessagesUseCase: GetUserMessagesUseCase
    private _getUserConversationUseCase: GetUserConversationsUseCase
    private _getAllConversationUseCase: GetAllConversationsUseCase

    constructor() {
        const messageRepo = new MessageRepository();
        const conversationRepo = new ConversationRepository();
        this._sendMessageUseCase = new SendMessageUseCase(messageRepo, conversationRepo);
        this._getMessagesUseCase = new GetMessagesUseCase(messageRepo);
        this._getUserMessagesUseCase = new GetUserMessagesUseCase(messageRepo);
        this._getUserConversationUseCase = new GetUserConversationsUseCase(conversationRepo)
        this._getAllConversationUseCase = new GetAllConversationsUseCase(conversationRepo)
    }

    public sendMessage = async (req: AuthenticatedRequest, res: Response) => {
        const senderId = req.userId;
        const senderRole = req.userRole;
        
        if (!senderId || !senderRole) {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({ error: "Sender ID and role are required." });
        }

        try {
            console.log("req.body: ", req.body);
            
            const { receiverRole, receiverId, text } = req.body;

            const message = await this._sendMessageUseCase.execute(senderId, senderRole, receiverId, receiverRole, text);
            // console.log("message: ", message);
            
            return res.status(HttpStatusEnum.CREATED).json(message);
        } catch (error) {
            return res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: "Error sending message" });
        }
    }

    public getUserConversations = async (req: AuthenticatedRequest, res: Response) => {
        try {
            console.log("Reached getUserConversations controller");
            
            const receiverId = req.params.receiverId;
            const currentUserId = req.userId
            const currentUserRole = req.userRole
            // console.log("currentUserId: ", currentUserId);
            // console.log("currentUserRole: ", currentUserRole);
            
            if(!currentUserId || !currentUserRole) {
                return "User detials missing in token"
            }

            const conversations = await this._getUserConversationUseCase.execute(currentUserId, currentUserRole);
            res.status(HttpStatusEnum.OK).json({ conversations });
          } catch (error) {
            res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch conversations." });
          }
    }

    public getMessages = async(req: AuthenticatedRequest, res: Response) => {
        try {
            const conversationId = req.params.conversationId;
            const messages = await this._getMessagesUseCase.execute(conversationId);
            res.status(200).json({ messages });
          } catch (error) {
            res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch messages." });
          }
    }

    public getUserMessages = async(req: AuthenticatedRequest, res: Response) => {
        try {
            const receiverId = req.query.receiverId as string;
            const currentUserId = req.userId;
            if(!currentUserId || !receiverId) {
                return "User detials missing in token"
            }
            const messages = await this._getUserMessagesUseCase.execute(currentUserId, receiverId);
            res.status(200).json({ messages });
          } catch (error) {
            res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch messages." });
          }
    }

    public getAllConversations = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const conversations = await this._getAllConversationUseCase.execute();
            return res.status(HttpStatusEnum.OK).json({ success: true, data: conversations });
        } catch (error) {
            console.error("Error fetching conversations:", error);
            return res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to fetch conversations" });
        }
    }

    // public getUserConversation = async(req: AuthenticatedRequest, res: Response) => {
    //     try {
            
    //     } catch (error) {
            
    //     }
    // }
}
