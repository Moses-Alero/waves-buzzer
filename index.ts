import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Socket } from "socket.io/dist/socket";
import { sentMessageHandler } from "./src/messageHandler";
import { fakeUserData } from "./mockDB";
import { IUser } from "./src/interfaces";
import { prismaClient } from './src/prisma';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer,{
    cors:{
        origin: ["http://localhost:3000", "https://admin.socket.io"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});



io.on("connection", (socket:Socket)=>{
    socket.on("clientDetails", async (clientDetails:IUser)=>{
        
        const user = await prismaClient.user.upsert({
            create:{
                accountName: clientDetails.userAccountName,
                 address: clientDetails.userAccountAddress,
                 socketId: clientDetails.socketId,
                 alias: clientDetails.userAccountName
            }, 
            update:{
                socketId: clientDetails.socketId
            },
            where:{
                address: clientDetails.userAccountAddress
            }
        })

        console.log(user);
        

        // const user:IUser |undefined = fakeUserData.find((userData)=>{
        //    return userData.userAccountAddress === clientDetails.userAccountAddress
        // })
        
        // if(!user){
        //     fakeUserData.push(clientDetails)
        // }
        // if(user){
        //     const userIndex = fakeUserData.indexOf(user);
        //     fakeUserData[userIndex].socketId = clientDetails.socketId
        // }       
        
    })

  sentMessageHandler(io,socket);

  socket.on('disconnect', ()=>{
    console.log(`user is offline ${socket.id}`);
    
})
});

const port = 8000


httpServer.listen(port, ()=>{
    console.log(`Server is live on port ${port}`);
    
})

