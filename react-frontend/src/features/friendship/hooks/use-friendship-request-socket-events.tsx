import { useSocket } from "@/context/socket-context";
import { useEffect } from "react";
import { toast } from "sonner";
import AcceptFriendRequestButton from "../components/accept-friend-request-button";
import { useQueryClient } from "@tanstack/react-query";

export default function useFriendshipRequestSocketEvents() {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  useEffect(() => {
    function onFriendshipRequest(request: FriendshipRequestReceived) {
      toast.info(`Received friend request from ${request.fromUser.name}`, {
        action: <AcceptFriendRequestButton requestId={request.id} />,
      });
      queryClient.invalidateQueries({
        queryKey: ["friendship-requests", "received"],
      });
      queryClient.setQueryData<FriendshipRequestReceived[]>(
        ["friendship-requests", "received"],
        (prev) => {
          if (!prev) return prev;
          return [...prev, request];
        }
      );
    }

    function onFriendshipRequestAccepted(request: FriendshipRequestSent) {
      toast.info(`${request.toUser.name} accepted your friend request`);
      queryClient.invalidateQueries({
        queryKey: ["friendship-requests", "sent"],
      });
      queryClient.invalidateQueries({
        queryKey: ["friendships", "all"],
      });
      queryClient.setQueryData<FriendshipRequestSent[]>(
        ["friendship-requests", "sent"],
        (prev) => {
          if (!prev) return prev;
          return prev.map((r) =>
            r.id === request.id ? { ...r, status: "accepted" } : r
          );
        }
      );
      queryClient.setQueryData<User[]>(["friendships", "all"], (prev) => {
        if (!prev) return prev;
        return [...prev, request.toUser];
      });
    }

    function onFriendshipRequestRejected(request: FriendshipRequestSent) {
      toast.info(`${request.toUser.name} rejected your friend request`);
      queryClient.invalidateQueries({
        queryKey: ["friendship-requests", "sent"],
      });
      queryClient.setQueryData<FriendshipRequestSent[]>(
        ["friendship-requests", "sent"],
        (prev) => {
          if (!prev) return prev;
          return prev.map((r) =>
            r.id === request.id ? { ...r, status: "rejected" } : r
          );
        }
      );
    }

    socket.on("friendship-request", onFriendshipRequest);
    socket.on("friendship-request-accepted", onFriendshipRequestAccepted);
    socket.on("friendship-request-rejected", onFriendshipRequestRejected);

    return () => {
      socket.off("friendship-request", onFriendshipRequest);
      socket.off("friendship-request-accepted", onFriendshipRequestAccepted);
      socket.off("friendship-request-rejected", onFriendshipRequestRejected);
    };
  }, [socket, queryClient]);
}
