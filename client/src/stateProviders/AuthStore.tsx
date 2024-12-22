import { create } from "zustand";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, db, googleAuthProvider } from "../firebase/FirebaseApp";
import { socket } from "../services/websocket";
import { collection, doc, setDoc } from "firebase/firestore";

interface User {
    id: string;
    name: string;
    photo: string;
    status?: string;
}

type AuthState = {
    currentUser: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    logOut: () => Promise<void>;
};

const useAuthStore = create<AuthState>((set) => {
    const initializeAuth = () => {
        set({ loading: true });
        onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                console.log(currentUser)
                const userData: User = {
                    id: currentUser.uid,
                    photo: currentUser.photoURL || "Unknown",
                    name: currentUser.displayName || "Unknown",
                    status: "active", // Default or dynamically fetched
                };
                socket.emit("login", currentUser.uid);
                const userRef = doc(collection(db, "users"), currentUser.uid);
                await setDoc(userRef, userData, { merge: true });
                set({
                    currentUser: userData,
                    loading: false,
                });
            } else {
                set({
                    currentUser: null,
                    loading: false,
                });
            }
        });
    };

    initializeAuth();

    return {
        currentUser: null,
        loading: true,
        signInWithGoogle: async () => {
            try {
                const result = await signInWithPopup(auth, googleAuthProvider);
                const userData: User = {
                    id: result.user.uid,
                    photo: result.user.photoURL || "Unknown",
                    name: result.user.displayName || "Unknown",
                    status: "active", // Default or dynamically fetched
                };
                socket.emit("login", result.user.uid);
                const userRef = doc(collection(db, "users"), result.user.uid);
                await setDoc(userRef, result.user, { merge: true });

                set({
                    currentUser: userData
                });

            } catch (error) {
                console.error("Google sign-in error:", error);
            }
        },
        logOut: async () => {
            try {
                await signOut(auth);
                socket.emit("logout", auth.currentUser?.uid || "");
                set({ currentUser: null });
            } catch (error) {
                console.error("Sign-out error:", error);
            }
        },
    };
});

export default useAuthStore;
