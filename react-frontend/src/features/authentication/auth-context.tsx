import { client } from "@/api/client";
import * as AuthAPI from "./api";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

type AuthContextType = {
  currentUser: User | null;
  isPending: boolean;
  isAuthenticated: boolean;
  authenticate: (token: string) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isPending, setIsPending] = useState<boolean>(true);
  const isAuthenticated = currentUser !== null;

  async function authenticate(token: string) {
    localStorage.setItem("token", token);
    const user = await AuthAPI.getCurrentUser();
    setCurrentUser(user);
    return user;
  }

  async function logout() {
    setIsPending(true);
    setCurrentUser(null);
    try {
      await AuthAPI.logout();
      await queryClient.invalidateQueries();
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("token");
      navigate("/sign-in");
      setIsPending(false);
    }
  }

  useEffect(() => {
    client.interceptors.response.use(
      async (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          setCurrentUser(null);
          localStorage.removeItem("token");
          await queryClient.invalidateQueries();
          navigate("/sign-in");
        }
        return Promise.reject(error);
      }
    );
  }, [queryClient, navigate]);

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
