import { create } from 'zustand';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/FirebaseApp';
import { User } from "./AuthStore";


export interface Message {
    from: string;
    to: string;
    timestamp: number;
    [key: string]: any;
}

interface ChatStore {
    currentUser: User | null;
    selectedFriend: User | null;
    chatMessages: Message[];
    setCurrentUser: (user: User | null) => void;
    setSelectedFriend: (friend: User | null) => void;
    fetchMessages: (friend: User) => Promise<void>;
    setChatMessages: (messages: Message[]) => void; // New setter
}

const useChatStore = create<ChatStore>((set, get) => ({
    currentUser: null,
    selectedFriend: null,
    chatMessages: [],

    setCurrentUser: (user) => set({ currentUser: user }),

    setSelectedFriend: (friend) => set({ selectedFriend: friend }),

    fetchMessages: async (friend) => {
        const { currentUser } = get();

        if (!currentUser) return;

        const currentUserMessagesRef = collection(db, 'chatroom', currentUser.id, 'messages');
        const friendMessagesRef = collection(db, 'chatroom', friend.id, 'messages');

        try {
            const currentUserQuery = query(
                currentUserMessagesRef,
                where('from', 'in', [currentUser.id, friend.id]),
                where('to', 'in', [currentUser.id, friend.id])
            );

            const friendQuery = query(
                friendMessagesRef,
                where('from', 'in', [currentUser.id, friend.id]),
                where('to', 'in', [currentUser.id, friend.id])
            );

            const [currentUserSnapshot, friendSnapshot] = await Promise.all([
                getDocs(currentUserQuery),
                getDocs(friendQuery),
            ]);

            const currentUserMessages = currentUserSnapshot.docs.map((doc) => doc.data() as Message);
            const friendMessages = friendSnapshot.docs.map((doc) => doc.data() as Message);

            const combinedMessages = [...currentUserMessages, ...friendMessages];
            combinedMessages.sort((a, b) => a.timestamp - b.timestamp);

            set({ chatMessages: combinedMessages, selectedFriend: friend });
        } catch (error) {
            console.error('Error fetching messages:', error);
            alert('An error occurred while fetching messages.');
        }
    },
    setChatMessages: (messages) => {
        set({ chatMessages: messages }); // New setter logic
    },
}));

export default useChatStore;
