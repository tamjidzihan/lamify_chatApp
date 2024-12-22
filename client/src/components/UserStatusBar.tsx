import { LogOut } from 'lucide-react'
import BurgerMenu from './BurgerMenu'
import useAuthStore from '../stateProviders/AuthStore'

const UserStatusBar = () => {

    const { logOut, currentUser } = useAuthStore()
    return (
        <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center">
                <BurgerMenu />
                <img
                    src={currentUser?.photo}
                    alt="Current user avatar"
                    className="w-8 h-8 rounded-full"
                />
                <span className="ml-2 font-medium">{currentUser?.name}</span>
            </div>
            <button onClick={logOut} className="text-gray-600 hover:text-gray-800">
                <LogOut size={20} />
            </button>
        </div>
    )
}

export default UserStatusBar