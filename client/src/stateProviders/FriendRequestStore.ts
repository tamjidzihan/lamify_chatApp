import { create } from "zustand";
import { collection, addDoc, query, where, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/FirebaseApp";

// Define FriendRequest type
export interface FriendRequest {
    from: string;
    to: string;
    status: "pending" | "accepted";
    user?: User; // Optional user info
}

// Define User type
interface User {
    id: string;
    name: string;
    photo: string;
    status?: string;
}

type FriendRequestState = {
    friendRequests: (FriendRequest & { user?: User })[];
    friends: User[]; // Added friends state
    sendFriendRequest: (toUser: User | null, currentUser: User | null) => Promise<void>;
    fetchFriendRequests: (currentUserId: string | null) => Promise<void>;
    acceptFriendRequest: (request: FriendRequest) => Promise<void>;
    deleteFriendRequest: (request: FriendRequest) => Promise<void>;
    fetchFriends: (currentUser: User | null) => Promise<void>;
};

const useFriendRequestStore = create<FriendRequestState>((set) => ({
    friendRequests: [],
    friends: [],
    sendFriendRequest: async (toUser, currentUser) => {
        if (!currentUser || !toUser) {
            alert("Both users must be specified to send a friend request.");
            return;
        }

        // Query to check if a friend request already exists
        const friendRequestQuery = query(
            collection(db, "friend_requests"),
            where("from", "==", currentUser.id),
            where("to", "==", toUser.id)
        );

        try {
            const existingRequests = await getDocs(friendRequestQuery);
            if (!existingRequests.empty) {
                alert(`You have already sent a friend request to ${toUser.name}.`);
                return;
            }

            // No existing request, proceed to send a new friend request
            const requestData: FriendRequest = {
                from: currentUser.id,
                to: toUser.id,
                status: "pending",
            };

            await addDoc(collection(db, "friend_requests"), requestData);
            alert(`Friend request sent to ${toUser.name}`);
        } catch (error) {
            console.error("Error checking or sending friend request:", error);
            alert("An error occurred while processing the friend request.");
        }
    },

    fetchFriendRequests: async (currentUserId) => {
        if (!currentUserId) {
            console.warn("User is not logged in. Cannot fetch friend requests.");
            return;
        }

        try {
            const requestsRef = collection(db, "friend_requests");
            const q = query(requestsRef, where("to", "==", currentUserId));
            const querySnapshot = await getDocs(q);

            const requests = querySnapshot.docs.map((doc) => doc.data() as FriendRequest);

            // Now fetch the user information for each request sender
            const usersRef = collection(db, "users");  // Assuming user info is stored in the "users" collection
            const users = await Promise.all(
                requests.map(async (request) => {
                    const userQuery = query(usersRef, where("id", "==", request.from));
                    const userSnapshot = await getDocs(userQuery);
                    const userData = userSnapshot.docs.map((doc) => doc.data())[0];  // Assuming each "from" is unique

                    // Cast to User type
                    const user: User = {
                        id: userData.id,
                        name: userData.name,
                        photo: userData.photo,
                    };

                    return { ...request, user };  // Merge the request with the user info
                })
            );

            set({ friendRequests: users });  // Now store the requests with user info in the state
        } catch (error) {
            console.error("Error fetching friend requests:", error);
        }
    },

    acceptFriendRequest: async (request) => {
        const { from, to } = request;

        const friend1 = { userId: from, friendId: to };
        const friend2 = { userId: to, friendId: from };

        try {
            await addDoc(collection(db, "friends"), friend1);
            await addDoc(collection(db, "friends"), friend2);

            const requestsRef = collection(db, "friend_requests");
            const q = query(
                requestsRef,
                where("from", "==", from),
                where("to", "==", to)
            );

            const querySnapshot = await getDocs(q);
            for (const doc of querySnapshot.docs) {
                await deleteDoc(doc.ref);
            }

            alert("Friend request accepted!");
            set({ friendRequests: [] });
        } catch (error) {
            console.error("Error accepting friend request:", error);
            alert("An error occurred while accepting the friend request.");
        }
    },

    deleteFriendRequest: async (request) => {
        const { from, to } = request;
        try {
            const requestsRef = collection(db, "friend_requests");
            const q = query(
                requestsRef,
                where("from", "==", from),
                where("to", "==", to)
            );
            const querySnapshot = await getDocs(q);
            for (const doc of querySnapshot.docs) {
                await deleteDoc(doc.ref);
            }
            alert("Friend request deleted.");
            set((state) => ({
                friendRequests: state.friendRequests.filter(
                    (req) => !(req.from === from && req.to === to)
                ),
            }));
        } catch (error) {
            console.error("Error deleting friend request:", error);
            alert("An error occurred while deleting the friend request.");
        }
    },

    fetchFriends: async (currentUser) => {
        if (!currentUser) return;
        try {
            const friendsRef = collection(db, "friends");
            const q = query(friendsRef, where("userId", "==", currentUser.id));
            const querySnapshot = await getDocs(q);
            const friendIds = querySnapshot.docs.map((doc) => doc.data().friendId);
            const friendsData: User[] = [];
            for (const id of friendIds) {
                const userRef = doc(db, "users", id);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) friendsData.push(userDoc.data() as User);
            }

            set({ friends: friendsData });
        } catch (error) {
            console.error("Error fetching friends:", error);
        }
    },

}));

export default useFriendRequestStore;
