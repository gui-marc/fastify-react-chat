import { client } from "@/api/client";
import * as AuthAPI from "./api";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthContextType = {
  currentUser: User | null;
  isPending: boolean;
  isAuthenticated: boolean;
  authenticate: (token: string) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isPending, setIsPending] = useState<boolean>(true);
  const isAuthenticated = useMemo(() => currentUser !== null, [currentUser]);

  async function authenticate(token: string) {
    localStorage.setItem("token", token);
    const user = await AuthAPI.getCurrentUser();
    setCurrentUser(user);
    return user;
  }

  function logout() {
    setIsPending(true);
    setCurrentUser(null);
    localStorage.removeItem("token");
    AuthAPI.logout().finally(() => setIsPending(false));
  }

  useEffect(() => {
    client.interceptors.response.use(
      async (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const abortController = new AbortController();

    if (token && !currentUser) {
      AuthAPI.getCurrentUser()
        .then((user) => {
          setCurrentUser(user);
        })
        .finally(() => setIsPending(false));
    } else {
      setIsPending(false);
    }

    return () => {
      abortController.abort();
    };
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{ currentUser, isPending, isAuthenticated, authenticate, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useAuthLogged() {
  const context = useAuth();

  if (!context.isAuthenticated) {
    throw new Error("User is not logged in");
  }

  return context as AuthContextType & {
    currentUser: User;
    isAuthenticated: true;
    isPending: false;
  };
}
