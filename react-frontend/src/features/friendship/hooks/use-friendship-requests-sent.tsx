import { useQuery } from "@tanstack/react-query";
import { getFriendRequestsSent } from "../api";

export function useFriendshipRequestsSent() {
  const data = useQuery({
    queryKey: ["friendship-requests", "sent"],
    queryFn: getFriendRequestsSent,
  });

  return data;
}
