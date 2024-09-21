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
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from "@/components/empty-state";
import { HeartHandshakeIcon, UserPlusIcon } from "lucide-react";
import AddFriendDialog from "../components/add-friend-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import FadeIn from "@/components/transitions/fade-in";

function Empty({ search }: { search: string }) {
  const isEmptySearch = search?.trim() === "";

  return (
    <EmptyState className="min-h-[60svh]">
      <EmptyStateIcon Icon={HeartHandshakeIcon} />
      {isEmptySearch ? (
        <EmptyStateTitle>No friend requests found</EmptyStateTitle>
      ) : (
        <EmptyStateTitle>No results found for "{search}"</EmptyStateTitle>
      )}
      {isEmptySearch ? (
        <EmptyStateDescription>
          You don't have any pending friend requests. Search for users to add
          them as friends.
        </EmptyStateDescription>
      ) : (
        <EmptyStateDescription>
          We couldn't find any pending friend requests matching your search. Try
          another query.
        </EmptyStateDescription>
      )}
      <AddFriendDialog>
        <Button variant="outline" className="gap-2 mt-5">
          <UserPlusIcon className="w-[1.2rem] h-[1.2rem]" />
          Add friend
        </Button>
      </AddFriendDialog>
    </EmptyState>
  );
}
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
  const [search, setSearch] = useState("");

  const { data: requests } = useFriendshipRequests();

  const filteredRequests = requests?.filter(
    (req) =>
      req.fromUser.name.toLowerCase().includes(search.toLowerCase()) ||
      req.fromUser.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Input
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for a friend..."
        className="w-full mb-5"
      />

      <FadeIn>
        {!filteredRequests && <Loading />}

        {filteredRequests && filteredRequests.length === 0 && (
          <Empty search={search} />
        )}

        {filteredRequests && filteredRequests.length > 0 && (
          <ol className="grid gap-3">
            {filteredRequests.map((request) => (
              <RequestItem key={request.id} request={request} />
            ))}
          </ol>
        )}
      </FadeIn>
    </div>
  );
}
