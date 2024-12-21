import useBurgerMenuStore from '../stateProviders/BurgerMenuStore'
import Conversations from './Conversations'
import SearchBar from './SearchBar'
import UserStatusBar from './UserStatusBar'

const SideBar = () => {
    const { isSidebarOpen } = useBurgerMenuStore()
    return (
        <div
            className={`
            fixed md:relative
        w-64 lg:w-96 
        h-full
        bg-white
        border-r
        flex flex-col
        transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0
      `}
        >
            <UserStatusBar />
            <SearchBar />
            <Conversations />
        </div>
    )
}

export default SideBar