import { Input } from "@/components/ui/input";
import UserAvatar from "@/components/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useFriendshipRequestsSent } from "../hooks/use-friendship-requests-sent";

function RequestItem({ request }: { request: FriendshipRequestSent }) {
  return (
    <li>
      <div>
        <UserAvatar user={request.toUser} />
        <span>{request.toUser.name}</span>
      </div>
      <span>{request.status}</span>
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
  const { data: requests } = useFriendshipRequestsSent();

  return (
    <div>
      <Input placeholder="Search for a friend..." className="w-full mb-5" />

      {!requests && <Loading />}

      {requests && requests.length === 0 && <p>No requests sent yet.</p>}

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
