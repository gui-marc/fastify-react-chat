import { useAuthLogged } from "@/features/authentication/auth-context";
import { hourAndMinute } from "@/lib/date";
import { CheckCheckIcon, HourglassIcon } from "lucide-react";

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
      <p className="flex items-center gap-2">
        {message.queryStatus === "pending" ? (
          <HourglassIcon className="w-[1rem] h-[1rem]" />
        ) : (
          <CheckCheckIcon className="w-[1rem] h-[1rem]" />
        )}
        {hourAndMinute(message.createdAt)}
      </p>
    </div>
  );
}
