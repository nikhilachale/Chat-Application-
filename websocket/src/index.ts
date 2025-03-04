
import { WebSocketServer, WebSocket } from "ws";
const wss = new WebSocketServer({ port: 8080 })
let allsockets: WebSocket[] = [];
wss.on("connection", (socket: WebSocket) => {
    allsockets.push(socket)
    console.log("user created : ");
    socket.on("message", (event) => {
        console.log("message recived:" + event.toString())
        for (let i = 0; i < allsockets.length; i++) {
            const s=allsockets[i];
            s.send(event.toString() + "sent from :" +s)
        }
    })

    socket.on("disconnect",()=>{
        allsockets=allsockets.filter(x=>x!=socket)
    })

})