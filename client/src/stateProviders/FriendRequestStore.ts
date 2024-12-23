// import { create } from "zustand";
// import { collection, addDoc, query, where, getDocs, deleteDoc } from "firebase/firestore";
// import { db } from "../firebase/FirebaseApp";



// interface User {
//     id: string;
//     name: string;
// }

// interface FriendRequest {
//     from: string;
//     to: string;
//     status: "pending" | "accepted";
// }



// type FriendRequestState = {
//     friendRequests: FriendRequest[];
//     sendFriendRequest: (toUser: User | null, currentUser: User | null) => Promise<void>;
//     fetchFriendRequests: (currentUserId: string | null) => Promise<void>;
//     acceptFriendRequest: (request: FriendRequest) => Promise<void>;
// };

// const useFriendRequestStore = create<FriendRequestState>((set) => ({
//     friendRequests: [],

//     sendFriendRequest: async (toUser, currentUser) => {
//         if (!currentUser || !toUser) {
//             alert("Both users must be specified to send a friend request.");
//             return;
//         }

//         const friendRequestQuery = query(
//             collection(db, "friend_requests"),
//             where("from", "==", currentUser.id),
//             where("to", "==", toUser.id)
//         );

//         try {
//             const existingRequests = await getDocs(friendRequestQuery);
//             if (!existingRequests.empty) {
//                 alert(`You have already sent a friend request to ${toUser.name}.`);
//                 return;
//             }

//             const requestData: FriendRequest = {
//                 from: currentUser.id,
//                 to: toUser.id,
//                 status: "pending",
//             };

//             await addDoc(collection(db, "friend_requests"), requestData);
//             alert(`Friend request sent to ${toUser.name}`);
//         } catch (error) {
//             console.error("Error checking or sending friend request:", error);
//             alert("An error occurred while processing the friend request.");
//         }
//     },


//     // Fetch friend requests and corresponding user information
//     fetchFriendRequests: async (currentUserId) => {
//         if (!currentUserId) {
//             console.warn("User is not logged in. Cannot fetch friend requests.");
//             return;
//         }

//         try {
//             const requestsRef = collection(db, "friend_requests");
//             const q = query(requestsRef, where("to", "==", currentUserId));
//             const querySnapshot = await getDocs(q);
//             const requests = querySnapshot.docs.map((doc) => doc.data() as FriendRequest);
//             const usersRef = collection(db, "users");
//             const users = await Promise.all(
//                 requests.map(async (request) => {
//                     const userQuery = query(usersRef, where("id", "==", request.from));
//                     const userSnapshot = await getDocs(userQuery);
//                     const user = userSnapshot.docs.map((doc) => doc.data())[0];
//                     return { ...request, user };
//                 })
//             );

//             set({ friendRequests: users });
//         } catch (error) {
//             console.error("Error fetching friend requests:", error);
//         }
//     },


//     acceptFriendRequest: async (request) => {
//         const { from, to } = request;

//         // Add to friends collection
//         const friend1 = { userId: from, friendId: to };
//         const friend2 = { userId: to, friendId: from };

//         try {
//             await addDoc(collection(db, "friends"), friend1);
//             await addDoc(collection(db, "friends"), friend2);

//             // Remove the request from friend_requests
//             const requestsRef = collection(db, "friend_requests");
//             const q = query(
//                 requestsRef,
//                 where("from", "==", from),
//                 where("to", "==", to)
//             );

//             const querySnapshot = await getDocs(q);
//             for (const doc of querySnapshot.docs) {
//                 await deleteDoc(doc.ref); // Corrected line
//             }

//             alert("Friend request accepted!");
//             set({ friendRequests: [] });  // Clear friend requests after accepting
//             // Optionally, you can call `fetchFriendRequests()` to refresh the list if needed
//             // fetchFriendRequests();
//             // fetchFriends(); // Assuming you implement a function to fetch the list of friends
//         } catch (error) {
//             console.error("Error accepting friend request:", error);
//             alert("An error occurred while accepting the friend request.");
//         }
//     }
// }));

// export default useFriendRequestStore;


import { create } from "zustand";
import { collection, addDoc, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/FirebaseApp";

// Define FriendRequest type
interface FriendRequest {
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
}

type FriendRequestState = {
    friendRequests: (FriendRequest & { user?: User })[]; // Specify that friendRequests contains FriendRequest with optional user
    sendFriendRequest: (toUser: User | null, currentUser: User | null) => Promise<void>;
    fetchFriendRequests: (currentUserId: string | null) => Promise<void>;
    acceptFriendRequest: (request: FriendRequest) => Promise<void>;
};

const useFriendRequestStore = create<FriendRequestState>((set) => ({
    friendRequests: [],

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

        // Add to friends collection
        const friend1 = { userId: from, friendId: to };
        const friend2 = { userId: to, friendId: from };

        try {
            await addDoc(collection(db, "friends"), friend1);
            await addDoc(collection(db, "friends"), friend2);

            // Remove the request from friend_requests
            const requestsRef = collection(db, "friend_requests");
            const q = query(
                requestsRef,
                where("from", "==", from),
                where("to", "==", to)
            );

            const querySnapshot = await getDocs(q);
            for (const doc of querySnapshot.docs) {
                await deleteDoc(doc.ref); // Corrected line
            }

            alert("Friend request accepted!");
            set({ friendRequests: [] });  // Clear friend requests after accepting
            // Optionally, you can call `fetchFriendRequests()` to refresh the list if needed
            // fetchFriendRequests();
            // fetchFriends(); // Assuming you implement a function to fetch the list of friends
        } catch (error) {
            console.error("Error accepting friend request:", error);
            alert("An error occurred while accepting the friend request.");
        }
    }
}));

export default useFriendRequestStore;
