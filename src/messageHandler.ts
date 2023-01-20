import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { IMessage } from "./interfaces";
import { prismaClient } from "./prisma";




export const sentMessageHandler = (io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, socket:Socket)=>{
    socket.on("clientSendMessage", async (messageData:IMessage, cb) => {
        console.log(messageData);

        try {
               const user = await prismaClient.user.findFirst({
                    where:{
                        address: messageData.messageTo
                    }
                })
                console.log(user);
                
                if(!user) throw new Error(`no user with address ${messageData.messageTo}`)
                io.to(user.socketId).emit("receivePrivateMessage", {content:messageData.content, sender: messageData.messageFrom, createdAt: messageData.createdAt})

        } catch (error) {
            const err = error as Error;
            console.log({err});
            
            return {error: err}
        }
   })
}