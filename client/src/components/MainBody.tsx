import React from 'react'
import ChatNavBar from './ChatNavBar'
import FriendsStatusBar from './FriendsStatusBar'
import ChatBox from './ChatBox'

const MainBody = () => {
    return (
        <div className="flex-1 flex flex-col w-full md:w-[calc(100%-16rem)] lg:w-[calc(100%-20rem)]">
            <div className="h-14 md:h-16 border-b flex items-center justify-between px-4 md:px-6">
                <ChatNavBar />
            </div>
            <FriendsStatusBar />
            <ChatBox />
        </div>
    )
}

export default MainBody