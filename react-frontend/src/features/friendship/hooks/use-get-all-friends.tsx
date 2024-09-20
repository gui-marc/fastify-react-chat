import { useQuery } from "@tanstack/react-query";
import { getFriends } from "../api";

export default function useGetAllFriends() {
  const data = useQuery({
    queryKey: ["friendships", "all"],
    queryFn: getFriends,
  });

  return data;
}
