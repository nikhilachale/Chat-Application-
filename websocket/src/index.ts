import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket;
    room: string;
}

let allsockets: User[] = [];

wss.on("connection", (socket: WebSocket) => {
    console.log("New client connected!");

    socket.on("message", (msg) => {
        try {
            const parsedMessage = JSON.parse(msg.toString());
            console.log("Received message:", parsedMessage);

            // Support both `payload` and `payLoad`
            const payload = parsedMessage.payload || parsedMessage.payLoad;

            if (!parsedMessage.type || !payload) {
                console.error("Invalid message format:", parsedMessage);
                return;
            }

            if (parsedMessage.type === "join") {
                if (!payload.roomId) {
                    console.error("Missing roomId in join message:", parsedMessage);
                    return;
                }

                allsockets.push({
                    socket,
                    room: payload.roomId,
                });

                console.log(`User joined room ${payload.roomId}`);
            }

            if (parsedMessage.type === "chat") {
                if (!payload.message) {
                    console.error("Missing message in chat payload:", parsedMessage);
                    return;
                }

                let currentUserRoom: string | null = null;

                // Find the room of the current user
                for (let user of allsockets) {
                    if (user.socket === socket) {
                        currentUserRoom = user.room;
                        break;
                    }
                }

                if (!currentUserRoom) {
                    console.error("User not in a room, ignoring chat message");
                    return;
                }

                console.log(`Broadcasting message to room ${currentUserRoom}:`, payload.message);

                for (let user of allsockets) {
                    if (user.room === currentUserRoom) {
                        user.socket.send(payload.message);
                    }
                }
            }
        } catch (error) {
            console.error("Error processing message:", error);
        }
    });

    socket.on("close", () => {
        console.log("Client disconnected");
        allsockets = allsockets.filter((user) => user.socket !== socket);
    });
});