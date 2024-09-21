import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelFriendRequest } from "../api";
import { toast } from "sonner";

export default function useCancelFriendRequest(requestId: string) {
  const queryClient = useQueryClient();

  const m = useMutation({
    mutationKey: ["friendship-request", "cancel"],
    mutationFn: () => cancelFriendRequest(requestId),
    onSuccess: () => {
      toast.success("Friend request cancelled");
      queryClient.invalidateQueries({
        queryKey: ["friendship-requests", "sent"],
      });
      queryClient.setQueryData<FriendshipRequestSent[]>(
        ["friendship-requests", "sent"],
        (data) => {
          if (!data) return data;
          return data.filter((r) => r.id !== requestId);
        }
      );
    },
    onError: () => {
      toast.error("Failed to cancel friend request");
    },
  });

  return m;
}
