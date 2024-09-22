import useConversationSocketEvents from "@/features/conversations/hooks/use-conversation-socket-events";
import useFriendshipRequestSocketEvents from "@/features/friendship/hooks/use-friendship-request-socket-events";

export default function SocketEvents() {
  useFriendshipRequestSocketEvents();
  useConversationSocketEvents();
  return null;
}
