import { Input } from "@/components/ui/input";
import UserAvatar from "@/components/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useFriendshipRequestsSent } from "../hooks/use-friendship-requests-sent";
import { cn } from "@/lib/utils";
import { AsyncButton } from "@/components/ui/async-button";
import useCancelFriendRequest from "../hooks/use-cancel-friend-request";
import FadeIn from "@/components/transitions/fade-in";
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from "@/components/empty-state";
import { useState } from "react";
import AddFriendDialog from "../components/add-friend-dialog";
import { Button } from "@/components/ui/button";
import { HeartPulseIcon, UserPlusIcon } from "lucide-react";

function Empty({ search }: { search: string }) {
  const isEmptySearch = search.trim() === "";

  return (
    <EmptyState className="min-h-[60svh]">
      <EmptyStateIcon Icon={HeartPulseIcon} />
      {isEmptySearch ? (
        <EmptyStateTitle>No friend requests sent</EmptyStateTitle>
      ) : (
        <EmptyStateTitle>
          No friend pending requests sent found for "{search}"
        </EmptyStateTitle>
      )}
      {isEmptySearch ? (
        <EmptyStateDescription>
          You don't have any pending friend requests sent. Search for users to
          add them as friends.
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

function RequestItem({ request }: { request: FriendshipRequestSent }) {
  const { mutate, isPending } = useCancelFriendRequest(request.id);

  return (
    <li className="flex items-center gap-4">
      <UserAvatar user={request.toUser} />
      <h3 className="max-w-[30vw] truncate">{request.toUser.name}</h3>
      <p className="hidden lg:block">{request.toUser.email}</p>
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
      <AsyncButton
        size="sm"
        variant="ghost"
        isLoading={isPending}
        disabled={request.status !== "pending"}
        onClick={() => mutate()}
      >
        Cancel
      </AsyncButton>
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
  const { data: requests } = useFriendshipRequestsSent();

  const filteredRequests = requests?.filter(
    (request) =>
      request.toUser.name.toLowerCase().includes(search.toLocaleLowerCase()) ||
      request.toUser.email.toLowerCase().includes(search.toLocaleLowerCase())
  );

  const pendingRequests = filteredRequests?.filter(
    (req) => req.status === "pending"
  );

  const acceptedRequests = filteredRequests?.filter(
    (req) => req.status === "accepted"
  );

  const rejectedRequests = filteredRequests?.filter(
    (req) => req.status === "rejected"
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
          <>
            {pendingRequests!.length > 0 && (
              <>
                <p className="text-sm px-3 mb-3 text-muted-foreground">
                  Pending requests
                </p>
                <ol className="grid gap-3 mb-5">
                  {pendingRequests!.map((request) => (
                    <RequestItem key={request.id} request={request} />
                  ))}
                </ol>
              </>
            )}
            {acceptedRequests!.length > 0 && (
              <>
                <p className="text-sm px-3 mb-3 text-muted-foreground">
                  Accepted requests
                </p>
                <ol className="grid gap-3 mb-5">
                  {acceptedRequests!.map((request) => (
                    <RequestItem key={request.id} request={request} />
                  ))}
                </ol>
              </>
            )}
            {rejectedRequests!.length > 0 && (
              <>
                <p className="text-sm px-3 mb-3 text-muted-foreground">
                  Rejected requests
                </p>
                <ol className="grid gap-3 mb-5">
                  {rejectedRequests!.map((request) => (
                    <RequestItem key={request.id} request={request} />
                  ))}
                </ol>
              </>
            )}
          </>
        )}
      </FadeIn>
    </div>
  );
}
