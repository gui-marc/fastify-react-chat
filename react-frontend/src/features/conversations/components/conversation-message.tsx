import { useAuthLogged } from "@/features/authentication/auth-context";
import { hourAndMinute } from "@/lib/date";

export default function ConversationMessage({
  message,
}: {
  message: ConversationMessage;
}) {
  const { currentUser } = useAuthLogged();

  const isCurrentUser = message.user.id === currentUser.id;

  return (
    <div
      className={`flex flex-col gap-1.5 justify-start ${
        isCurrentUser ? "items-end" : "items-start"
      }`}
    >
      <div
        className={`px-3 py-2 max-w-[70%] rounded-lg ${
          isCurrentUser
            ? "bg-primary text-primary-foreground"
            : "bg-accent text-accent-foreground"
        }`}
      >
        {message.content}
      </div>
      <p>{hourAndMinute(message.createdAt)}</p>
    </div>
  );
}
