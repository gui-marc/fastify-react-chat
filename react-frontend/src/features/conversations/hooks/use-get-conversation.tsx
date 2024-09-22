import { useQuery } from "@tanstack/react-query";
import { getConversation } from "../api";

export function useGetConversation(conversationId: string) {
  return useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => getConversation(conversationId),
  });
}
