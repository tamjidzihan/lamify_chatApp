// import React, { useEffect, useState } from "react";
// import useChatStore from "../stateProviders/ChatStore";


// const ConvNavBar: React.FC = () => {
//     const { currentUser, chatMessages } = useChatStore();
//     const [chatList, setChatList] = useState<{ name: string; avatar: string; status: string; lastMessage: string; time: string; unread: number }[]>([]);

//     useEffect(() => {
//         if (chatMessages.length && currentUser) {
//             // Group messages by users
//             const groupedChats = chatMessages.reduce((acc: any, msg) => {
//                 const chatPartnerId = msg.from === currentUser.id ? msg.to : msg.from;

//                 if (!acc[chatPartnerId]) {
//                     acc[chatPartnerId] = {
//                         name: msg.from === currentUser.id ? msg.toName : msg.fromName, // Assuming msg.toName and msg.fromName exist
//                         avatar: msg.from === currentUser.id ? msg.toAvatar : msg.fromAvatar, // Assuming msg.toAvatar and msg.fromAvatar exist
//                         status: "online", // Update status from user info if available
//                         lastMessage: msg.text,
//                         time: new Date(msg.timestamp).toLocaleTimeString(),
//                         unread: 0,
//                     };
//                 }

//                 // Update the last message and time
//                 acc[chatPartnerId].lastMessage = msg.text;
//                 acc[chatPartnerId].time = new Date(msg.timestamp).toLocaleTimeString();
//                 return acc;
//             }, {});

//             // Convert grouped data into an array and sort by timestamp
//             const sortedChats = Object.values(groupedChats).sort(
//                 (a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime()
//             );

//             setChatList(sortedChats);
//         }
//     }, [chatMessages, currentUser]);

//     return (
//         <div>
//             {chatList.map((chat, index) => (
//                 <div key={index} className="p-4 hover:bg-gray-50 cursor-pointer">
//                     <div className="flex items-center">
//                         <div className="relative">
//                             <img
//                                 src={chat.avatar}
//                                 alt={chat.name}
//                                 className="w-10 h-10 rounded-full"
//                             />
//                             <div
//                                 className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${chat.status === "online" ? "bg-green-500" : "bg-gray-400"}`}
//                             />
//                         </div>
//                         <div className="ml-3 flex-1">
//                             <div className="flex items-center justify-between">
//                                 <h3 className="font-medium">{chat.name}</h3>
//                                 <span className="text-sm text-gray-500">{chat.time}</span>
//                             </div>
//                             <div className="flex items-center justify-between">
//                                 <p className="text-sm text-gray-500 truncate">
//                                     {chat.lastMessage}
//                                 </p>
//                                 {chat.unread > 0 && (
//                                     <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                                         {chat.unread}
//                                     </span>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default ConvNavBar;









// const TEMPDATA = [
//     {
//         name: "Sarah Wilson",
//         avatar:
//             "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
//         status: "online",
//         message: "Hey, are you available for a call?",
//         time: "2m ago",
//         unread: 2,
//     },
//     {
//         name: "Design Team",
//         avatar:
//             "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop",
//         status: "offline",
//         message: "New design updates",
//         time: "1h ago",
//         unread: 0,
//     },
//     {
//         name: "Mike Johnson",
//         avatar:
//             "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
//         status: "online",
//         message: "Project deadline reminder",
//         time: "3h ago",
//         unread: 1,
//     },
// ]



// const ConvNavBar = () => {
//     return (
//         <>
//             {TEMPDATA.map((chat, index) => (
//                 <div key={index} className="p-4 hover:bg-gray-50 cursor-pointer">
//                     <div className="flex items-center">
//                         <div className="relative">
//                             <img
//                                 src={chat.avatar}
//                                 alt={chat.name}
//                                 className="w-10 h-10 rounded-full"
//                             />
//                             <div
//                                 className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${chat.status === "online" ? "bg-green-500" : "bg-gray-400"}`}
//                             />
//                         </div>
//                         <div className="ml-3 flex-1">
//                             <div className="flex items-center justify-between">
//                                 <h3 className="font-medium">{chat.name}</h3>
//                                 <span className="text-sm text-gray-500">{chat.time}</span>
//                             </div>
//                             <div className="flex items-center justify-between">
//                                 <p className="text-sm text-gray-500 truncate">
//                                     {chat.message}
//                                 </p>
//                                 {chat.unread > 0 && (
//                                     <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                                         {chat.unread}
//                                     </span>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             ))}
//         </>
//     )
// }

// export default ConvNavBar











import useChatStore from "../stateProviders/ChatStore";



const ConvNavBar = () => {
    const { selectedFriend, fetchMessages } = useChatStore();
    return (
        <div>
            {selectedFriend ? (
                <div className="p-4 bg-gray-100 border-b cursor-pointer" onClick={() => fetchMessages(selectedFriend)}>
                    <div className="flex items-center">
                        <img
                            src={selectedFriend.photo}
                            alt={selectedFriend.name}
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="ml-3">
                            <h3 className="font-medium">{selectedFriend.name}</h3>
                            <span className="text-sm text-gray-500">
                                {selectedFriend.status === "online" ? "Online" : "Offline"}
                            </span>
                            <p className="mt-1 text-sm text-gray-400">
                                {/* {lastMessage.length > 30 ? `${lastMessage.slice(0, 30)}...` : lastMessage} */}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-4 text-gray-500 text-center">Select a friend to chat</div>
            )}
        </div>
    );
};

export default ConvNavBar;
