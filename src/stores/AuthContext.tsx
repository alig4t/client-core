import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// 1. Define type for user object
// Adjust this type based on the actual structure of your user object
interface User {
  id: number;
  name: string;
  username: string;
  roles?: string[]; // roles may not exist
}

// 2. Define type for values that the Context provides
interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

// 3. Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Create Provider (main component)
export function AuthProvider({ children }: { children: ReactNode }) {
  // --- States ---
  // Read token from localStorage on initial load
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );

  // Read user information from localStorage on initial load
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    // To prevent errors if localStorage data is corrupted, use try-catch
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });


  // --- Effects for synchronization ---
  // This Effect updates localStorage whenever token or user changes
  useEffect(() => {
    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      // If one of them is null, clear both to keep the state consistent
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [token, user]);


  // --- Main functions ---
  // The login function now receives and stores both token and user
  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
  };

  // The logout function clears both token and user states
  const logout = () => {
    setToken(null);
    setUser(null);
  };


  // --- Derived State ---
  // The isAuthenticated variable is calculated based on the presence of the token
  const isAuthenticated =
    !!token &&
    token !== "undefined" &&
    token !== "null" &&
    token.length > 10;


  // --- Providing values to child components ---
  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}


// 5. Custom hook for easy use of Context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}