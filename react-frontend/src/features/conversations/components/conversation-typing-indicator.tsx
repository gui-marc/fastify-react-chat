import { cn } from "@/lib/utils";
import useConversationTyping from "../hooks/use-conversation-typing";

interface ConversationTypingIndicatorProps {
  user: User;
  conversationId: string;
  message: string;
  className?: string;
}

export default function ConversationTypingIndicator({
  user,
  conversationId,
  message,
  className,
}: ConversationTypingIndicatorProps) {
  const { otherUserIsTyping } = useConversationTyping(conversationId, message);

  return (
    <span
      className={cn(
        "text-muted-foreground transition-opacity",
        { "opacity-100": otherUserIsTyping, "opacity-0": !otherUserIsTyping },
        className
      )}
    >
      {user.name.split(" ")[0]} is typing...
    </span>
  );
}
