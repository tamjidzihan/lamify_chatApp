import ConvNavBar from "./ConvNavBar"
import FriendsRequest from "./FriendsRequest"

const Conversations = () => {
    return (
        <div className="flex-1 overflow-y-auto">
            <FriendsRequest />
            <ConvNavBar />
        </div>
    )
}

export default Conversations