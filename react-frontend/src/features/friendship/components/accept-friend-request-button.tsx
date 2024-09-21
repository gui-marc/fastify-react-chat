import { AsyncButton } from "@/components/ui/async-button";
import useAcceptFriendRequest from "../hooks/use-accept-friend-request";

export default function AcceptFriendRequestButton({
  requestId,
}: {
  requestId: string;
}) {
  const { mutate, isPending } = useAcceptFriendRequest();

  return (
    <AsyncButton
      variant="outline"
      size="sm"
      onClick={() => mutate(requestId)}
      isLoading={isPending}
    >
      Accept
    </AsyncButton>
  );
}
