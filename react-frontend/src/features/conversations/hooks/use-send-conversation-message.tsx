import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { sendConversationMessage } from "../api";
import { useAuthLogged } from "@/features/authentication/auth-context";

export default function useSendConversationMessage() {
  const { currentUser } = useAuthLogged();

  const queryClient = useQueryClient();

  const m = useMutation({
    mutationFn: sendConversationMessage,
    onMutate: async ({ data, conversationId }) => {
      await queryClient.cancelQueries({
        queryKey: ["conversation-messages", conversationId],
      });

      const previousMessages = queryClient.getQueryData<
        InfiniteData<ConversationMessage[]>
      >(["conversation-messages", conversationId]);

      const fakeMessage: ConversationMessage = {
        id: Math.random().toString(),
        content: data.content,
        user: currentUser,
        createdAt: new Date(),
        conversationId,
        reactions: [],
        queryStatus: "pending",
      };

      queryClient.setQueryData<InfiniteData<ConversationMessage[]>>(
        ["conversation-messages", conversationId],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: [[fakeMessage], ...old.pages],
          };
        }
      );

      return { previousMessages, fakeMessage };
    },
    onSettled: (conversation, error, { conversationId }, context) => {
      if (context && conversation) {
        queryClient.setQueryData<InfiniteData<ConversationMessage[]>>(
          ["conversation-messages", conversationId],
          (old) => {
            if (!old) return old;

            return {
              ...old,
              pages: old.pages.map((page) => {
                return page.map((m) => {
                  if (m.id === context.fakeMessage.id) {
                    return conversation;
                  }
                  return m;
                });
              }),
            };
          }
        );
      }
      if (conversation) {
        queryClient.setQueryData<Conversation[]>(["conversations"], (old) => {
          if (!old) return old;

          return old.map((c) => {
            if (c.id === conversationId) {
              return { ...c, messages: [conversation, ...c.messages] };
            }
            return c;
          });
        });
      }
      if (error) {
        queryClient.setQueryData<InfiniteData<ConversationMessage[]>>(
          ["conversation-messages", conversationId],
          (old) => {
            if (!old || !context?.fakeMessage) return old;

            return {
              ...old,
              pages: old.pages.map((page) => {
                return page.map((m) => {
                  if (m.id === context.fakeMessage.id) {
                    return {
                      ...m,
                      queryStatus: "error",
                    };
                  }
                  return m;
                });
              }),
            };
          }
        );
      }
    },
  });

  return m;
}
