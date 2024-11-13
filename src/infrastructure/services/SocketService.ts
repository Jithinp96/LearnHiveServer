import { Server as SocketIOServer, Socket } from "socket.io";
import { SendMessageUseCase } from "../../application/useCases/message/SendMessageUseCase";
import { MessageRepository } from "../repositories/MessageRepository";
import { ConversationRepository } from "../repositories/ConversationRepository";
import { GetMessagesUseCase } from "../../application/useCases/message/GetMessageUseCase";
import { GetUserConversationsUseCase } from "../../application/useCases/message/GetUserConversationUseCase";
import { UserRole } from "../../shared/enums/UserRoleEnum";

interface User {
    userId: string,
    socketId: string
}

interface SocketServiceOptions {
    io: SocketIOServer;
}

export class SocketService {
    private io: SocketIOServer;
    private sendMessageUseCase: SendMessageUseCase;
    private getMessagesUseCase: GetMessagesUseCase;
    private getUserConversationsUseCase: GetUserConversationsUseCase;

    constructor(options: SocketServiceOptions) {
        this.io = options.io;

        // Initialize repositories and use cases
        const messageRepo = new MessageRepository();
        const conversationRepo = new ConversationRepository();

        this.sendMessageUseCase = new SendMessageUseCase(messageRepo, conversationRepo);
        this.getMessagesUseCase = new GetMessagesUseCase(messageRepo);
        this.getUserConversationsUseCase = new GetUserConversationsUseCase(conversationRepo);

        this.registerSocketEvents();
    }

    private registerSocketEvents() {

        const users:User[] = [];
        const findUserById = ( userId: string): User | undefined => {
            return users.find(user => user.userId === userId);
          };


        this.io.on("connection", (socket: Socket) => {
            console.log("A user connected:", socket.id);

            socket.on("joinRoom", async ({userId} ) => {
                // }
                try {
                    console.log("userId",userId);
                    
                    const existingUser = users.find(user => user.userId === userId);

                    if (!existingUser) {
                        users.push({ userId, socketId: socket.id });
                        console.log(`User ${userId} joined with socket ID: ${socket.id}`);
                    } else {
                        console.log(`User ${userId} is already connected.`);
                    }
                    socket.join(userId);
                } catch (error) {
                    console.error("Error in socket join room: ", error);
                    
                }
            });

            // Handle sending a message
            socket.on("sendMessage", async ({ senderId, senderRole, receiverId, receiverRole, text }) => {
                try {
                    const message = {
                        senderId,
                        senderRole ,
                        receiverId,
                        receiverRole,
                        text
                    }

                    if (message) {
                        // Determine the room ID (could be a conversation ID)
                        const conversation = await this.sendMessageUseCase['_conversationRepository'].findByParticipants(senderId, receiverId);
                        const roomId = conversation?._id
                        const user=findUserById(receiverId)
                        if (user) {
                            this.io.to(user.socketId).emit("receiveMessage", message);
                        }
                    }
                } catch (error) {
                    console.error("Error sending message via socket:", error);
                    socket.emit("error", { message: "Failed to send message" });
                }
            });

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
