import { useSocket } from "@/context/socket-context";
import { useAuthLogged } from "@/features/authentication/auth-context";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { startTyping, stopTyping } from "../api";

export default function useConversationTyping(
  conversationId: string,
  message: string
) {
  const { currentUser } = useAuthLogged();
  const [currentIsTyping, setCurrentIsTyping] = useState(false);
  const [prevMessage, setPrevMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    async function type() {
      await startTyping(conversationId);
    }

    if (message !== "" && !currentIsTyping && message !== prevMessage) {
      type();
      setCurrentIsTyping(true);
    }
  }, [message, currentIsTyping, prevMessage, conversationId]);

  useDebounce(
    async () => {
      if (currentIsTyping && message !== prevMessage) {
        setCurrentIsTyping(false);
        setPrevMessage(message);
        await stopTyping(conversationId);
      }
    },
    2000,
    [currentIsTyping]
  );

  useEffect(() => {
    function onConversationTyping({
      userId,
      isTyping,
      conversationId: id,
    }: ConversationTyping) {
      if (userId === currentUser.id || id !== conversationId) {
        return;
      }

      setIsTyping(isTyping);
    }

    socket.on("conversation-typing", onConversationTyping);
    return () => {
      socket.off("conversation-typing", onConversationTyping);
    };
  }, [socket, currentUser, conversationId]);

  return {
    otherUserIsTyping: isTyping,
  };
}
