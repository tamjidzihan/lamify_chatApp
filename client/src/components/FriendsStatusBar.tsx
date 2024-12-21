import React from 'react'

const FRIENDSTEMPDATA = [
    {
        name: "Emma Stone",
        avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        status: "online",
    },
    {
        name: "Chris Evans",
        avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
        status: "online",
    },
    {
        name: "Robert Downey",
        avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
        status: "online",
    },
]

const FriendsStatusBar = () => {
    return (
        <div className="px-4 md:px-6 py-2 md:py-3 border-b overflow-x-auto">
            <div className="flex space-x-4">
                {FRIENDSTEMPDATA.map((user, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div className="relative">
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                        <span className="text-xs mt-1">{user.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FriendsStatusBar