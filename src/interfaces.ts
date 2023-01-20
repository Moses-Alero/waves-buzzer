export interface IMessage{
    messageId: string,
    messageFrom: string,
    messageTo: string,
    content: string,
    createdAt: Date
}

export interface IUser{
    id: string,
    userAccountAddress: string,
    userAccountName: string,
    socketId: string
}