// import { SendHorizontal } from 'lucide-react';
// import React, { useState } from 'react'

// const ChatBox = () => {
//     const [messages, setMessages] = useState([
//         {
//             id: 1,
//             sender: "Sarah Wilson",
//             content: "Hey, how are you?",
//             timestamp: "10:00 AM",
//             type: "received",
//         },
//         {
//             id: 2,
//             sender: "John Smith",
//             content: "I'm good! Just working on some projects.",
//             timestamp: "10:02 AM",
//             type: "sent",
//         },
//     ]);
//     const [inputMessage, setInputMessage] = useState("");
//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setInputMessage(e.target.value);
//     };
//     const handleSendMessage = () => {
//         if (inputMessage.trim()) {
//             const newMessage = {
//                 id: messages.length + 1,
//                 sender: "John Smith",
//                 content: inputMessage,
//                 timestamp: new Date().toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                 }),
//                 type: "sent",
//             };
//             setMessages([...messages, newMessage]);
//             setInputMessage("");
//         }
//     };
//     return (
//         <>

//             <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
//                 {messages.map((message) => (
//                     <div
//                         key={message.id}
//                         className={`flex ${message.type === "sent" ? "justify-end" : "justify-start"}`}
//                     >
//                         <div
//                             className={`max-w-[85%] md:max-w-[70%] rounded-lg p-3 ${message.type === "sent" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"}`}
//                         >
//                             <div className="flex items-center space-x-2 mb-1">
//                                 <span className="text-sm font-medium">{message.sender}</span>
//                                 <span className="text-xs opacity-75">
//                                     {message.timestamp}
//                                 </span>
//                             </div>
//                             <p>{message.content}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//             <div className="p-3 md:p-4 border-t">
//                 <div className="flex items-center space-x-2">
//                     <input
//                         type="text"
//                         value={inputMessage}
//                         onChange={handleInputChange}
//                         onKeyUp={(e) => {
//                             if (e.key === "Enter") {
//                                 handleSendMessage();
//                             }
//                         }}
//                         placeholder="Type a message..."
//                         className="flex-1 p-2 md:p-3 border rounded-lg"
//                     />
//                     <button
//                         onClick={handleSendMessage}
//                         className="p-2 md:p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//                     >
//                         <SendHorizontal size={25} />
//                     </button>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default ChatBox




import { SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../stateProviders/ChatStore";
import useAuthStore, { User } from "../stateProviders/AuthStore";

const ChatBox = () => {
    const { currentUser } = useAuthStore()
    const {
        chatMessages,
        newMessage,
        setNewMessage,
        sendMessage,
        fetchMessages,
        setSelectedFriend,
        initializeSocketListeners,
    } = useChatStore();

    const [selectedFriend, setFriend] = useState<User | null>(null);
    const messagesEndRef = useRef(null); // Ref for the end of the message list

    useEffect(() => {
        if (currentUser) {
            initializeSocketListeners(currentUser);
        }
        return () => {
            setSelectedFriend(null); // Cleanup on unmount
        };
    }, [currentUser, initializeSocketListeners]);

    useEffect(() => {
        if (currentUser && selectedFriend) {
            fetchMessages(currentUser, selectedFriend);
        }
    }, [currentUser, selectedFriend, fetchMessages]);

    // useEffect(() => {
    //     // Scroll to the bottom whenever chatMessages change
    //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // }, [chatMessages]);

    const handleInputChange = (e: any) => {
        setNewMessage(e.target.value);
    };

    const handleSendMessage = async () => {
        await sendMessage(currentUser);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                {chatMessages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.from === currentUser?.id ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`max-w-[85%] md:max-w-[70%] rounded-lg p-3 ${message.from === currentUser?.id
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-900"
                                }`}
                        >
                            <div className="flex items-center space-x-2 mb-1">
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
                <div ref={messagesEndRef}></div>
            </div>
            <div className="p-3 md:p-4 border-t">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={handleInputChange}
                        onKeyUp={(e) => {
                            if (e.key === "Enter") {
                                handleSendMessage();
                            }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 p-2 md:p-3 border rounded-lg"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="p-2 md:p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <SendHorizontal size={25} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
