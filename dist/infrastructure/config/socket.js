"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = initializeSocket;
const socket_io_1 = require("socket.io");
const SocketService_1 = require("../services/SocketService");
function initializeSocket(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.CORSURL,
            methods: ["GET", "POST"],
            credentials: true
        }
    });
    new SocketService_1.SocketService({ io });
    return io;
}
