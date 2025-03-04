"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let uc = 0;
let allsockets = [];
wss.on("connection", (socket) => {
    allsockets.push(socket);
    console.log("user created : ", + ++uc);
    socket.on("message", (event) => {
        console.log("message recived:" + event.toString());
        for (let i = 0; i < allsockets.length; i++) {
            const s = allsockets[i];
            s.send(event.toString() + "sent from :" + s);
        }
    });
});
