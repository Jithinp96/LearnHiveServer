import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { SocketService } from "../services/SocketService";

export function initializeSocket(server: HttpServer) {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.CORSURL,
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    new SocketService({ io });

    return io;
}