export interface IMessage {
    _id?: string,
    senderId: string,
    receiverId: string,
    message: string,
    status: string,
}