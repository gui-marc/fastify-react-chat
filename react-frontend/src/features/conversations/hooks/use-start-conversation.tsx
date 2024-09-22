import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startConversation } from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function useStartConversation({
  shouldNavigate = false,
}: {
  shouldNavigate?: boolean;
}) {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const m = useMutation({
    mutationKey: ["start-conversation"],
    mutationFn: (friendId: string) => startConversation(friendId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      if (shouldNavigate) {
        navigate(`/conversations/${data.id}`);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return m;
}
