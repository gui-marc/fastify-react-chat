import { useAuth } from "@/features/authentication/auth-context";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  autoConnect: false,
  auth(cb) {
    const token = localStorage.getItem("token");
    cb({ token });
  },
  withCredentials: true,
  retries: 3,
});

interface SocketListenEvents {
  ["connect"]: () => void;
  ["friendship-request"]: (req: FriendshipRequestReceived) => void;
  ["friendship-request-accepted"]: (req: FriendshipRequestSent) => void;
  ["friendship-request-rejected"]: (req: FriendshipRequestSent) => void;
  ["conversation-message"]: (req: ConversationMessage) => void;
}

type SocketContextType = {
  socket: Socket<SocketListenEvents, object>;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType | null>(null);

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const socketRef = useRef(socket);

  const { isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  const authenticated = useMemo(() => isAuthenticated, [isAuthenticated]);

  useEffect(() => {
    const socket = socketRef.current;

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    if (authenticated) {
      socket.connect();
      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
    }

    return () => {
      socket.disconnect();
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [authenticated]);

  return (
    <SocketContext.Provider value={{ isConnected, socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within an SocketProvider");
  }

  return context;
}
