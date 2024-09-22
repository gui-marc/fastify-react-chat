import { useInfiniteQuery } from "@tanstack/react-query";
import { getConversationMessages } from "../api";

const PAGE_SIZE = 20;

export default function useConversationMessages(conversationId: string) {
  const query = useInfiniteQuery({
    queryKey: ["conversation-messages", conversationId],
    queryFn: ({ pageParam }) =>
      getConversationMessages({
        conversationId,
        cursorId: pageParam,
        take: PAGE_SIZE,
      }),
    initialPageParam: "",
    getNextPageParam: (lastPage) =>
      lastPage.length === PAGE_SIZE
        ? lastPage[lastPage.length - 1].id
        : undefined,
  });

  const data = query.data?.pages.flatMap((p) => p);

  return { ...query, data };
}
