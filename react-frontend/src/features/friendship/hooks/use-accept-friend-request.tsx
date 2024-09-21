import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest } from "../api";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function useAcceptFriendRequest(requestId: string) {
  const queryClient = useQueryClient();

  const m = useMutation({
    mutationKey: ["friendship-requests", "accept"],
    mutationFn: () => acceptFriendRequest(requestId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["friendship-requests", "received"],
      });
      queryClient.invalidateQueries({
        queryKey: ["friendships", "all"],
      });
      queryClient.setQueryData<FriendshipRequestReceived[]>(
        ["friendship-requests", "received"],
        (prev) => {
          if (!prev) return prev;
          return prev.filter((r) => r.id !== requestId);
        }
      );
      queryClient.setQueryData<User[]>(["friendships", "all"], (prev) => {
        if (!prev) return prev;
        return [...prev, data.fromUser];
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data.message
          : "Error while accepting friend request"
      );
    },
  });

  return m;
}
