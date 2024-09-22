import { useSocket } from "@/context/socket-context";
import { useAuthLogged } from "@/features/authentication/auth-context";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function useConversationSocketEvents() {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const { currentUser } = useAuthLogged();

  useEffect(() => {
    function onConversationMessage(message: ConversationMessage) {
      if (message.user.id === currentUser.id) return;

      queryClient.setQueryData<InfiniteData<ConversationMessage[]>>(
        ["conversation-messages", message.conversationId],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: [[message], ...old.pages],
          };
        }
      );

      queryClient.setQueryData<Conversation[]>(["conversations"], (old) => {
        if (!old) return old;

        return old.map((c) => {
          if (c.id === message.conversationId) {
            return {
              ...c,
              messages: [message, ...c.messages],
            };
          }
          return c;
        });
      });
    }
    socket.on("conversation-message", onConversationMessage);
    return () => {
      socket.off("conversation-message", onConversationMessage);
    };
  }, [socket, queryClient, currentUser]);
}
