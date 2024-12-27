import { useEffect } from 'react'
import useAuthStore from '../stateProviders/AuthStore'
import useFriendRequestStore from '../stateProviders/FriendRequestStore'
import useChatStore from '../stateProviders/ChatStore'

const FriendsStatusBar = () => {
    const { friends, fetchFriends } = useFriendRequestStore()
    const { currentUser } = useAuthStore()
    const { setSelectedFriend, fetchMessages } = useChatStore();
    useEffect(() => {
        if (currentUser) {
            fetchFriends(currentUser)
        }
    }, [])

    return (
        <div className="px-4 md:px-6 md:py-3 border-b scroll-smooth">
            <div className="flex space-x-5">
                {friends.map((user, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => {
                            setSelectedFriend(user)
                            fetchMessages(user)
                        }}>
                        <div className="relative">
                            <img
                                src={user.photo}
                                alt={user.name}
                                className="w-10 h-10 rounded-full"
                            />
                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user.status === "online" ? "bg-green-500" : "bg-gray-400"}`} />
                        </div>
                        <span className="text-xs mt-1">{user.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FriendsStatusBar