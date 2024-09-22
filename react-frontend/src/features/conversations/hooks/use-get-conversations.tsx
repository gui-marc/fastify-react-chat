import { useQuery } from "@tanstack/react-query";
import { getConversations } from "../api";

export default function useGetConversations() {
  const query = useQuery({
    queryKey: ["conversations"],
    queryFn: () => getConversations(),
  });

  return query;
}
