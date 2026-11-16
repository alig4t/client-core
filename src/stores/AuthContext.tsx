import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
interface Permission {
  id: number;
  name: string;
  showName: string;
}
interface Role {
  id: number;
  name: string;
  permission: Permission[];
}
export interface User {
  id: number;
  name: string;
  username: string;
  roles: Role[];
}
interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  hasPermission: (name: string) => boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
function loadSession(): { token: string | null; user: User | null } {
  try {
    const token = localStorage.getItem("token");
    const user: User | null = JSON.parse(
      localStorage.getItem("user") ?? "null",
    );
    if (
      !token ||
      token === "undefined" ||
      token === "null" ||
      !user ||
      !Array.isArray(user.roles)
    )
      return { token: null, user: null };
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}
export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [session, setSession] = useState(loadSession);
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    queryClient.clear();
    setSession({ token: null, user: null });
    navigate("/login", { replace: true });
  }, [navigate, queryClient]);
  useEffect(() => {
    const expire = () => logout();
    const sync = (event: StorageEvent) => {
      if (event.key === "token" || event.key === "user") {
        queryClient.clear();
        setSession(loadSession());
      }
    };
    window.addEventListener("core:unauthorized", expire);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("core:unauthorized", expire);
      window.removeEventListener("storage", sync);
    };
  }, [logout, queryClient]);
  const login = (token: string, user: User) => {
    queryClient.clear();
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setSession({ token, user });
    navigate("/dashboard");
  };
  const hasPermission = useCallback(
    (name: string) =>
      Boolean(
        session.user?.roles.some(
          (role) =>
            Array.isArray(role.permission) &&
            role.permission.some((permission) => permission.name === name),
        ),
      ),
    [session.user],
  );
  return (
    <AuthContext.Provider
      value={{
        ...session,
        isAuthenticated: Boolean(session.token && session.user),
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
