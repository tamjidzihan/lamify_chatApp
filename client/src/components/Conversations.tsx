import { useEffect } from "react"
import useAuthStore from "../stateProviders/AuthStore"
import useFriendRequestStore from "../stateProviders/FriendRequestStore"


const TEMPDATA = [
    {
        name: "Sarah Wilson",
        avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        status: "online",
        message: "Hey, are you available for a call?",
        time: "2m ago",
        unread: 2,
    },
    {
        name: "Design Team",
        avatar:
            "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop",
        status: "offline",
        message: "New design updates",
        time: "1h ago",
        unread: 0,
    },
    {
        name: "Mike Johnson",
        avatar:
            "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
        status: "online",
        message: "Project deadline reminder",
        time: "3h ago",
        unread: 1,
    },
]

const Conversations = () => {

    const { friendRequests, fetchFriendRequests } = useFriendRequestStore()
    const { currentUser } = useAuthStore()

    useEffect(() => {
        if (currentUser) {
            fetchFriendRequests(currentUser.id);
        }
    }, [currentUser?.id, fetchFriendRequests]);

    return (
        <div className="flex-1 overflow-y-auto">

            {friendRequests.map((request) =>
                <div key={`${request.from}-${request.to}`} className="p-4 hover:bg-gray-200 bg-cyan-100 cursor-pointer mb-2">
                    <div className="flex items-center">
                        <div className="relative">
                            <img
                                src={request.user?.photo}
                                alt={request.user?.name}
                                className="w-10 h-10 rounded-full"
                            />

                        </div>
                        <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">{request.user?.name}</h3>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-500 truncate">
                                    Has send You a Friend Request
                                </p>

                            </div>
                        </div>
                    </div>
                </div>
            )}


            {TEMPDATA.map((chat, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center">
                        <div className="relative">
                            <img
                                src={chat.avatar}
                                alt={chat.name}
                                className="w-10 h-10 rounded-full"
                            />
                            <div
                                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${chat.status === "online" ? "bg-green-500" : "bg-gray-400"}`}
                            />
                        </div>
                        <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">{chat.name}</h3>
                                <span className="text-sm text-gray-500">{chat.time}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-500 truncate">
                                    {chat.message}
                                </p>
                                {chat.unread > 0 && (
                                    <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {chat.unread}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Conversations