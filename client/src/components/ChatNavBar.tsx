import { Phone, Video, Settings, MoreVertical } from 'lucide-react'
import BurgerMenu from './BurgerMenu'
import useChatStore from '../stateProviders/ChatStore'
import Logo from '../assets/logo_v1.png'


const ChatNavBar = () => {
    const { selectedFriend } = useChatStore()

    return (
        <>

            {selectedFriend ? (
                <>
                    <div className=" py-4 flex items-center">
                        <BurgerMenu />
                        <img
                            src={selectedFriend.photo}
                            className="w-10 h-10 ml-4 md:ml-0 rounded-full"
                        />
                        <div className="ml-3">
                            <h2 className="font-medium">{selectedFriend.name}</h2>
                            <p className={`text-sm ${selectedFriend.status === "online" ? "text-green-500" : "text-red-500"} `}>{selectedFriend.status}</p>
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
            ) : (
                <>
                    <div className=" py-4 flex items-center">
                        <BurgerMenu />
                        <img
                            src={Logo}
                            className="w-10 h-10 ml-4 md:ml-0 rounded-full"
                        />
                        <div className="ml-3">
                            <h2 className="font-medium">Lamify Chat App</h2>
                            <p className="text-sm text-green-500">Select A friend to chat</p>
                        </div>

                    </div>

                </>
            )
            }
        </>
    )
}

export default ChatNavBar