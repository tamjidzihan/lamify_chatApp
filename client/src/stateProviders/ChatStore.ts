import { create } from "zustand";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/FirebaseApp";
import { User } from "./AuthStore";
import { socket } from "../services/websocket";


interface Message {
    from: string;
    to: string;
    content: string;
    timestamp: number;
}


interface ChatStore {
    chatMessages: Message[];
    selectedFriend: User | null;
    newMessage: string;
    setNewMessage: (message: string) => void;
    setSelectedFriend: (friend: User | null) => void;
    sendMessage: (currentUser: User | null) => Promise<void>;
    fetchMessages: (currentUser: User, friend: User) => Promise<void>;
    initializeSocketListeners: (currentUser: User | null) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
    chatMessages: [],
    selectedFriend: null,
    newMessage: "",
    setNewMessage: (message) => set({ newMessage: message }),
    setSelectedFriend: (friend) => set({ selectedFriend: friend }),
    sendMessage: async (currentUser) => {
        const { selectedFriend, newMessage, chatMessages } = get();
        if (!currentUser || !selectedFriend || !newMessage.trim()) return;

        const messageData: Message = {
            from: currentUser.id,
            to: selectedFriend.id,
            content: newMessage,
            timestamp: Date.now(),
        };

        // Emit via Socket.IO
        socket.emit("sendMessage", messageData);

        // Save to Firestore
        await addDoc(collection(db, "chatroom", currentUser.id, "messages"), messageData);

        set({
            chatMessages: [...chatMessages, messageData],
            newMessage: "",
        });
    },
    fetchMessages: async (currentUser, friend) => {
        if (!currentUser) return;

        const currentUserMessagesRef = collection(db, "chatroom", currentUser.id, "messages");
        const friendMessagesRef = collection(db, "chatroom", friend.id, "messages");

        try {
            const currentUserQuery = query(
                currentUserMessagesRef,
                where("from", "in", [currentUser.id, friend.id]),
                where("to", "in", [currentUser.id, friend.id])
            );

            const friendQuery = query(
                friendMessagesRef,
                where("from", "in", [currentUser.id, friend.id]),
                where("to", "in", [currentUser.id, friend.id])
            );

            const [currentUserSnapshot, friendSnapshot] = await Promise.all([
                getDocs(currentUserQuery),
                getDocs(friendQuery),
            ]);

            const currentUserMessages = currentUserSnapshot.docs.map((doc) => doc.data() as Message);
            const friendMessages = friendSnapshot.docs.map((doc) => doc.data() as Message);

            const combinedMessages = [...currentUserMessages, ...friendMessages];
            combinedMessages.sort((a, b) => a.timestamp - b.timestamp);

            set({
                chatMessages: combinedMessages,
                selectedFriend: friend,
            });
        } catch (error) {
            console.error("Error fetching messages:", error);
            alert("An error occurred while fetching messages.");
        }
    },
    initializeSocketListeners: (currentUser) => {
        socket.on("receiveMessage", (message: Message) => {
            const { selectedFriend, chatMessages } = get();

            if (
                (message.from === currentUser?.id && message.to === selectedFriend?.id) ||
                (message.to === currentUser?.id && message.from === selectedFriend?.id)
            ) {
                set({ chatMessages: [...chatMessages, message] });
            }
        });

        return () => {
            socket.off("receiveMessage");
        };
    },
}));
