const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { initializeApp } = require("firebase/app");
const { getFirestore, doc, updateDoc } = require("firebase/firestore");
const { PORT, FIREBASE_CONFIG, ORIGIN } = require("./constants")


// initialize firebase Database
const app = express();
const firebaseApp = initializeApp(FIREBASE_CONFIG)
const db = getFirestore(firebaseApp);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        // origin: "http://localhost:5173", 
        origin: ORIGIN,
        methods: ["GET", "POST"],
    },
});

const users = {}; // Map to store connected users

// Helper to update user status in Firestore
const updateUserStatus = async (userId, status) => {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { status });
    } catch (error) {
        console.error(`Error updating status for user ${userId}:`, error);
    }
};


app.get("/", (req, res) =>
    res.status(200).json({ message: "WebSocket Process Started" })
);

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("login", async (userId) => {
        users[userId] = socket.id;
        await updateUserStatus(userId, "online");
        io.emit("userStatus", { userId, status: "online" });
        console.log(`New user Login : ${userId}`)
    });

    socket.on("sendMessage", (message) => {
        const recipientSocketId = users[message.to];
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("receiveMessage", message);
        }
    });

    socket.on("disconnect", async () => {
        for (const userId in users) {
            if (users[userId] === socket.id) {
                delete users[userId];
                await updateUserStatus(userId, "offline");
                io.emit("userStatus", { userId, status: "offline" });
                console.log(`user disconnected : ${userId}`)
            }
        }
    });
});


server.listen(PORT, () => {
    console.log(`✅ Server is listening on port: ${PORT}`)
});