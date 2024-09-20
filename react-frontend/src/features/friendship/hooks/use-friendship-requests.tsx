import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../api";

export function useFriendshipRequests() {
  const data = useQuery({
    queryKey: ["friendship-requests", "received"],
    queryFn: () => getFriendRequests,
  });

  return data;
}
