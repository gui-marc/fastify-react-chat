import { Input } from "@/components/ui/input";
import UserAvatar from "@/components/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useFriendshipRequests } from "../hooks/use-friendship-requests";
import { AsyncButton } from "@/components/ui/async-button";
import useAcceptFriendRequest from "../hooks/use-accept-friend-request";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipPortal } from "@radix-ui/react-tooltip";

function RequestItem({ request }: { request: FriendshipRequestReceived }) {
  const { isPending, mutate } = useAcceptFriendRequest();

  function onClick() {
    mutate(request.id);
  }

  return (
    <li className="flex items-center gap-4">
      <UserAvatar user={request.fromUser} />
      <h3>{request.fromUser.name}</h3>
      <p>{request.fromUser.email}</p>
      <span
        className={cn(
          "ml-auto px-3 py-1.5 rounded-md text-xs uppercase tracking-wide font-medium",
          {
            "bg-accent text-accent-foreground": request.status === "pending",
            "bg-error text-error-contrast": request.status === "rejected",
          }
        )}
      >
        {request.status}
      </span>
      <Tooltip>
        <TooltipTrigger asChild>
          <AsyncButton
            onClick={onClick}
            isLoading={isPending}
            variant="ghost"
            size="sm"
            disabled={request.status !== "pending"}
          >
            Accept
          </AsyncButton>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent>
            Accept friend request from {request.fromUser.name}
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </li>
  );
}

function Loading() {
  return (
    <ul className="grid gap-3">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className="w-full h-10 rounded-lg" />
      ))}
    </ul>
  );
}

export default function AllFriendshipsPage() {
  const { data: requests } = useFriendshipRequests();

  return (
    <div>
      <Input placeholder="Search for a friend..." className="w-full mb-5" />

      {!requests && <Loading />}

      {requests && requests.length === 0 && (
        <p>No pending friendship requests.</p>
      )}

      {requests && requests.length > 0 && (
        <ol className="grid gap-3">
          {requests.map((request) => (
            <RequestItem key={request.id} request={request} />
          ))}
        </ol>
      )}
    </div>
  );
}
