import { Search } from 'lucide-react'
import React from 'react'

const SearchBar = () => {
    return (
        <div className="p-4">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-8 pr-4 py-2 border rounded-lg"
                />
                <Search
                    size={16}
                    className="absolute left-2.5 top-3 text-gray-400"
                />
            </div>
        </div>
    )
}

export default SearchBar