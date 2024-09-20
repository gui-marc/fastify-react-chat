import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest } from "../api";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function useAcceptFriendRequest() {
  const queryClient = useQueryClient();

  const data = useMutation({
    mutationKey: ["friendship-requests", "accept"],
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["friendship-requests", "received"],
      });
      queryClient.invalidateQueries({
        queryKey: ["friendships", "all"],
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

  return data;
}
