import { create } from "zustand";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/FirebaseApp";

interface User {
    id: string;
    name: string;
    photo: string;
    status?: string;
}


type SearchState = {
    searchResults: User[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    handleSearch: (currentUserId: string | null) => Promise<void>;
};

const useSearchStore = create<SearchState>((set, get) => ({
    searchResults: [],
    searchTerm: "",

    setSearchTerm: (term: string) => {
        set({ searchTerm: term });
    },

    handleSearch: async (currentUserId: string | null) => {
        const { searchTerm } = get();
        if (!searchTerm.trim()) return;

        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("name", "==", searchTerm.trim()));
            const querySnapshot = await getDocs(q);

            // Extract user data from snapshot
            const results = querySnapshot.docs
                .map((doc) => ({ ...doc.data(), id: doc.id } as User))
                .filter((user) => user.id !== currentUserId); // Exclude current user

            set({ searchResults: results });

            if (results.length === 0) {
                alert("No users found with that username.");
            }
        } catch (error) {
            console.error("Error searching users:", error);
            alert("An error occurred while searching for users.");
        }
    },
}));

export default useSearchStore;
