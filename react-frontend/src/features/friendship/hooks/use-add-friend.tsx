import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendFriendRequest } from "../api";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function useAddFriend() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: (data) => {
      console.log({ data });
      queryClient.invalidateQueries({
        queryKey: ["friendship-requests", "sent"],
      });
      toast.success(`Sent friend request to ${data.toUser.name}`);
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.message
          : "Error while sending friend request"
      );
    },
  });

  return mutation;
}
