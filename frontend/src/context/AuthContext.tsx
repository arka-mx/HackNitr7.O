import React, { createContext, useContext, useEffect, useState } from "react";
import { type User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase";

// Extend User type to include local user properties if needed
type AuthUser = User | { uid: string; email: string; displayName: string, accessToken?: string } | null;

interface AuthContextType {
    currentUser: AuthUser;
    loading: boolean;
    logout: () => Promise<void>;
    login: (token: string, user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    loading: true,
    logout: async () => { },
    login: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<AuthUser>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        // 1. Check Local Storage for Native Token
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                setCurrentUser(user);
                setLoading(false);
                return; // Stop here if local auth found
            } catch (e) {
                console.error("Failed to parse local user", e);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }

        // 2. Fallback to Firebase Auth
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (isMounted) {
                if (!token) { // Only set if no local token (priority to local if present? or simple coexistence)
                    // Actually, if firebase user is present, they override local? 
                    // Let's settle on: specific explicit login sets state.
                    // But on refresh:
                    // If stored token exists, use it.
                    // Else wait for firebase.
                    setCurrentUser(user);
                }
                setLoading(false);
            }
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    const logout = async () => {
        try {
            await signOut(auth); // Firebase Logout
        } catch (e) {
            console.error("Firebase logout error", e);
        }
        localStorage.removeItem('token'); // Local Logout
        localStorage.removeItem('user');
        setCurrentUser(null);
    };

    const login = (token: string, user: AuthUser) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);
    };

    const value = {
        currentUser,
        loading,
        logout,
        login
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
