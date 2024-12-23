import { useEffect } from 'react'
import useAuthStore from '../stateProviders/AuthStore';
import useFriendRequestStore, { FriendRequest } from '../stateProviders/FriendRequestStore';

const FriendsRequest = () => {
    const { friendRequests, fetchFriendRequests, acceptFriendRequest } = useFriendRequestStore()
    const { currentUser } = useAuthStore()

    useEffect(() => {
        if (currentUser) {
            fetchFriendRequests(currentUser.id);
        }
    }, [currentUser?.id, fetchFriendRequests]);

    const handleAccept = async (request: FriendRequest) => {
        try {
            await acceptFriendRequest(request);
            alert('Friend request accepted successfully!');
        } catch (error) {
            console.error('Error accepting friend request:', error);
            alert('Failed to accept the friend request.');
        }
    };
    return (
        <>
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
                                <button
                                    onClick={() => handleAccept(request)}
                                    className="accept-button bg-green-500 text-white'"
                                >
                                    Accept
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default FriendsRequest