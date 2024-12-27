import { useEffect, useRef, useState } from 'react';
import { socket } from '../services/websocket';
import useAuthStore from '../stateProviders/AuthStore';
import useChatStore from '../stateProviders/ChatStore';

import {
    addDoc,
    collection,
} from "firebase/firestore";
import { db } from '../firebase/FirebaseApp';
import { SendHorizontal } from 'lucide-react';


interface Message {
    from: string;
    to: string;
    content: string;
    timestamp: number;
}

const ChatBox = () => {
    const [newMessage, setNewMessage] = useState("");
    const { currentUser } = useAuthStore()
    const { selectedFriend, chatMessages, setChatMessages, setCurrentUser } = useChatStore()

    const sendMessage = async () => {
        if (!currentUser || !selectedFriend || !newMessage.trim()) return;
        const messageData: Message = {
            from: currentUser.id,
            to: selectedFriend.id,
            content: newMessage,
            timestamp: Date.now(),
        };
        socket.emit("sendMessage", messageData);
        await addDoc(collection(db, "chatroom", currentUser.id, "messages"), messageData);
        setChatMessages([...chatMessages, messageData]);
        setNewMessage("");
    };

    useEffect(() => {
        if (!currentUser) return;

        setCurrentUser(currentUser)

        socket.on("receiveMessage", (message: Message) => {
            if (
                (message.from === currentUser?.id && message.to === selectedFriend?.id) ||
                (message.to === currentUser?.id && message.from === selectedFriend?.id)
            ) {
                setChatMessages([...chatMessages, message]);
            }
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [currentUser, selectedFriend, chatMessages, setChatMessages]);


    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);


    return (
        <>
            <div className="flex flex-col h-screen" >
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                    {chatMessages.map((message, idx) => (
                        <div
                            key={idx}
                            className={`flex ${message.from === currentUser?.id ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[85%] md:max-w-[70%] rounded-lg p-3 ${message.from === currentUser?.id
                                    ? "bg-blue-500 text-white"
                                    : "bg-green-200 text-gray-900"
                                    }`}
                            >
                                <div className="flex items-center space-x-2  mb-1 ">
                                    <span className="text-sm font-medium">
                                        {message.from === currentUser?.id ? "You" : selectedFriend?.name || "Friend"}
                                    </span>
                                    <span className="text-xs opacity-75">
                                        {new Date(message.timestamp).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                                <p>{message.content}</p>
                            </div>
                        </div>
                    ))}
                    <div className='h-48 md:h-36 lg:h-28' ref={messagesEndRef}></div>
                </div>
                <div className="p-3 md:p-4 bg-white sticky bottom-0">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            autoFocus
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyUp={(e) => {
                                if (e.key === "Enter") {
                                    sendMessage();
                                }
                            }}
                            placeholder="Type a message..."
                            className="flex-1 p-2 md:p-3 border rounded-lg"
                        />
                        <button
                            onClick={sendMessage}
                            className="p-2 md:p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            <SendHorizontal size={25} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChatBox




// import { SendHorizontal } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { useChatStore } from "../stateProviders/ChatStore";
// import useAuthStore, { User } from "../stateProviders/AuthStore";

// const ChatBox = () => {
//     const { currentUser } = useAuthStore()
//     const {
//         chatMessages,
//         newMessage,
//         setNewMessage,
//         sendMessage,
//         fetchMessages,
//         setSelectedFriend,
//         initializeSocketListeners,
//     } = useChatStore();

//     const [selectedFriend, setFriend] = useState<User | null>(null);
//     const messagesEndRef = useRef(null); // Ref for the end of the message list

//     useEffect(() => {
//         if (currentUser) {
//             initializeSocketListeners(currentUser);
//         }
//         return () => {
//             setSelectedFriend(null); // Cleanup on unmount
//         };
//     }, [currentUser, initializeSocketListeners]);

//     useEffect(() => {
//         if (currentUser && selectedFriend) {
//             fetchMessages(currentUser, selectedFriend);
//         }
//     }, [currentUser, selectedFriend, fetchMessages]);

//     // useEffect(() => {
//     //     // Scroll to the bottom whenever chatMessages change
//     //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     // }, [chatMessages]);

//     const handleInputChange = (e: any) => {
//         setNewMessage(e.target.value);
//     };

//     const handleSendMessage = async () => {
//         await sendMessage(currentUser);
//     };

//     return (
// < div className = "flex flex-col h-full" >
//     <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
//         {chatMessages.map((message, index) => (
//             <div
//                 key={index}
//                 className={`flex ${message.from === currentUser?.id ? "justify-end" : "justify-start"
//                     }`}
//             >
//                 <div
//                     className={`max-w-[85%] md:max-w-[70%] rounded-lg p-3 ${message.from === currentUser?.id
//                         ? "bg-blue-500 text-white"
//                         : "bg-gray-100 text-gray-900"
//                         }`}
//                 >
//                     <div className="flex items-center space-x-2 mb-1">
//                         <span className="text-sm font-medium">
//                             {message.from === currentUser?.id ? "You" : selectedFriend?.name || "Friend"}
//                         </span>
//                         <span className="text-xs opacity-75">
//                             {new Date(message.timestamp).toLocaleTimeString([], {
//                                 hour: "2-digit",
//                                 minute: "2-digit",
//                             })}
//                         </span>
//                     </div>
//                     <p>{message.content}</p>
//                 </div>
//             </div>
//         ))}
//         <div ref={messagesEndRef}></div>
//     </div>
//     <div className="p-3 md:p-4 border-t">
//         <div className="flex items-center space-x-2">
//             <input
//                 type="text"
//                 value={newMessage}
//                 onChange={handleInputChange}
//                 onKeyUp={(e) => {
//                     if (e.key === "Enter") {
//                         handleSendMessage();
//                     }
//                 }}
//                 placeholder="Type a message..."
//                 className="flex-1 p-2 md:p-3 border rounded-lg"
//             />
//             <button
//                 onClick={handleSendMessage}
//                 className="p-2 md:p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//             >
//                 <SendHorizontal size={25} />
//             </button>
//         </div>
//     </div>
// </div >
//     );
// };

// export default ChatBox;
