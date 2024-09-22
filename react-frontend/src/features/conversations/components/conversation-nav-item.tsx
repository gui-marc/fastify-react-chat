import UserAvatar from "@/features/users/components/user-avatar";
import { hourAndMinute } from "@/lib/date";
import { cn } from "@/lib/utils";
import { CornerUpRightIcon } from "lucide-react";
import { Link, useMatch } from "react-router-dom";

export default function ConversationNavItem({
  conversation,
}: {
  conversation: Conversation;
}) {
  const isInConversation = useMatch(`/conversations/${conversation.id}`);

  const lastMessage = conversation.messages[0];

  return (
    <Link
      className={cn(
        "flex items-center justify-start text-left px-4 py-2 bg-transparent rounded-lg gap-3",
        {
          "bg-accent text-accent-foreground": isInConversation,
        }
      )}
      to={`/conversations/${conversation.id}`}
    >
      <UserAvatar user={conversation.friend} withStatus />
      <div className="w-full">
        <h4 className="max-w-[200px] truncate font-medium">
          {conversation.friend.name}
        </h4>
        {lastMessage && (
          <p className="text-muted-foreground flex items-center gap-1.5">
            {lastMessage.user.id !== conversation.friend.id && (
              <CornerUpRightIcon className="w-[1rem] h-[1rem] shrink-0" />
            )}
            <span className="max-w-[150px] truncate block">
              {lastMessage.content}
            </span>
            <span className="text-xs ml-auto block">
              {hourAndMinute(lastMessage.createdAt)}
            </span>
          </p>
        )}
      </div>
    </Link>
  );
}
