import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { sendConversationMessage } from "../api";

export default function useSendConversationMessage() {
  const queryClient = useQueryClient();

  const m = useMutation({
    mutationFn: sendConversationMessage,
    onSuccess: (data) => {
      queryClient.setQueryData<InfiniteData<ConversationMessage[]>>(
        ["conversation-messages", data.conversationId],
        (prev) => {
          if (!prev) return prev;

          const lastPage = prev.pages[prev.pages.length - 1];

          if (lastPage.length < 20) {
            return {
              ...prev,
              pages: prev.pages.map((page, i) => {
                if (i === prev.pages.length - 1) {
                  return [data, ...page];
                }
                return page;
              }),
            };
          }

          return {
            ...prev,
            pages: [[data], ...prev.pages],
          };
        }
      );
      queryClient.setQueryData<Conversation[]>(["conversations"], (prev) => {
        if (!prev) return prev;

        return prev.map((c) => {
          if (c.id === data.conversationId) {
            return { ...c, messages: [data, ...c.messages] };
          }
          return c;
        });
      });
    },
  });

  return m;
}
