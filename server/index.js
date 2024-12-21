const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { PORT } = require("./constants/environment")

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        // origin: "http://localhost:5173", 
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const users = {}; // Map to store connected users
app.get("/", (req, res) =>
    res.status(200).json({ message: "WebSocket Process Started" })
);


io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("login", (userId) => {
        users[userId] = socket.id;
        io.emit("userStatus", { userId, status: "online" });
    });

    socket.on("sendMessage", (message) => {
        const recipientSocketId = users[message.to];
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("receiveMessage", message);
        }
    });

    socket.on("disconnect", () => {
        for (const userId in users) {
            if (users[userId] === socket.id) {
                delete users[userId];
                io.emit("userStatus", { userId, status: "offline" });
            }
        }
    });
});

server.listen(PORT, () => console.log(`✅ Server is listening on port: ${PORT}`));