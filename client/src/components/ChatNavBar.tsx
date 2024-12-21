import { Phone, Video, Settings, MoreVertical } from 'lucide-react'
import BurgerMenu from './BurgerMenu'


const ChatNavBar = () => {
    return (
        <>
            <div className="flex items-center">
                <BurgerMenu />
                <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                    alt="Chat partner avatar"
                    className="w-10 h-10 rounded-full"
                />
                <div className="ml-3">
                    <h2 className="font-medium">Sarah Wilson</h2>
                    <p className="text-sm text-green-500">Online</p>
                </div>

            </div>
            <div className="flex items-center space-x-4">
                {/* <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Phone size={20} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Video size={20} className="text-gray-600" />
                </button> */}
                <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Settings size={20} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                    <MoreVertical size={20} className="text-gray-600" />
                </button>
            </div>
        </>
    )
}

export default ChatNavBar