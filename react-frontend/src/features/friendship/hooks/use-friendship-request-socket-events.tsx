import { useSocket } from "@/context/socket-context";
import { useEffect } from "react";
import { toast } from "sonner";
import AcceptFriendRequestButton from "../components/accept-friend-request-button";

export default function useFriendshipRequestSocketEvents() {
  const { socket } = useSocket();

  useEffect(() => {
    function onFriendshipRequest(request: FriendshipRequestReceived) {
      toast.info(`Received friend request from ${request.fromUser.name}`, {
        action: <AcceptFriendRequestButton requestId={request.id} />,
      });
    }

    function onFriendshipRequestAccepted(request: FriendshipRequestSent) {
      toast.info(`${request.toUser.name} accepted your friend request`);
    }

    function onFriendshipRequestRejected(request: FriendshipRequestSent) {
      toast.info(`${request.toUser.name} rejected your friend request`);
    }

    socket.on("friendship-request", onFriendshipRequest);
    socket.on("friendship-request-accepted", onFriendshipRequestAccepted);
    socket.on("friendship-request-rejected", onFriendshipRequestRejected);

    return () => {
      socket.off("friendship-request", onFriendshipRequest);
      socket.off("friendship-request-accepted", onFriendshipRequestAccepted);
      socket.off("friendship-request-rejected", onFriendshipRequestRejected);
    };
  }, [socket]);
}
