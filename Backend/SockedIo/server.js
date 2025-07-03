import {Server} from "socket.io"
import http from "http"
import express from "express"



const app = express();
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:"https://chatapp-7ihx.onrender.com",
        methods:["GET","POST"]
    }
})

//realtime msg code
const users={}
const getReceiverSocketId=(receiverId)=>{
    return users[receiverId]
}
export default getReceiverSocketId
//used to listen the evenets on the server side
io.on("connection",(socket)=>{
    console.log("A user connected",socket.id)
    const userId=socket.handshake.query.userId
    if(userId){
        users[userId]=socket.id;
        console.log("Hello",users)
    }
    io.emit("getOnlineUsers",Object.keys(users))
    //used to listen clien side evenets on server side
    socket.on("disconnect",()=>{
        console.log("A user disconnected",socket.id)
        delete users[userId]
        io.emit("getOnlineUsers",Object.keys(users))
    })
})
export{app,server,io}
