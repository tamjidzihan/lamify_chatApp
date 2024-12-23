import { Search } from 'lucide-react';
import { useState } from 'react';
import useSearchStore from '../stateProviders/SearchStore';
import useFriendRequestStore from '../stateProviders/FriendRequestStore';
import useAuthStore from '../stateProviders/AuthStore';

interface User {
    id: string;
    name: string;
}

const SearchBar = () => {
    const { setSearchTerm, handleSearch, searchResults } = useSearchStore();
    const { sendFriendRequest } = useFriendRequestStore();
    const { currentUser } = useAuthStore();
    const [localSearchTerm, setLocalSearchTerm] = useState('');
    const [sentRequests, setSentRequests] = useState<Record<string, boolean>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchTerm(e.target.value);
    };

    const performSearch = async () => {
        setSearchTerm(localSearchTerm);
        await handleSearch(null); // Pass `null` or currentUserId if required
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            await performSearch();
        }
    };

    const handleSendFriendRequest = async (toUser: User) => {
        try {
            await sendFriendRequest(toUser, currentUser);
            setSentRequests((prev) => ({ ...prev, [toUser.id]: true })); // Mark as sent
        } catch (error) {
            console.error('Failed to send friend request', error);
        }
    };

    return (
        <div className="p-4">
            <div className="relative">
                <input
                    type="text"
                    value={localSearchTerm}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Search conversations..."
                    className="w-full pl-8 pr-4 py-2 border rounded-lg"
                />
                <Search
                    size={16}
                    className="absolute left-2.5 top-3 text-gray-400 cursor-pointer"
                    onClick={performSearch}
                />
            </div>
            {searchResults.length > 0 && (
                <div className="mt-4 bg-white shadow-lg rounded-lg p-4">
                    {searchResults.map((result) => (
                        <div key={result.id} className="flex justify-between px-2 border-b last:border-0">
                            <p className="font-medium">{result.name}</p>
                            <button
                                onClick={() => handleSendFriendRequest(result)}
                                className={`px-2 py-1 rounded ${sentRequests[result.id]
                                    ? 'bg-gray-500 text-white cursor-not-allowed'
                                    : 'bg-green-500 text-white'
                                    }`}
                                disabled={sentRequests[result.id]} // Disable button if request is sent
                            >
                                {sentRequests[result.id] ? 'Request Sent' : 'Add Friend'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
