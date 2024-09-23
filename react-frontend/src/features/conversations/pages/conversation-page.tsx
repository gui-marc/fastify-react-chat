import InfiniteScroll from "react-infinite-scroll-component";
import { AsyncButton } from "@/components/ui/async-button";
import { Input } from "@/components/ui/input";
import { Navigate, useParams } from "react-router-dom";
import useSendConversationMessage from "../hooks/use-send-conversation-message";
import { useForm } from "react-hook-form";
import {
  SendConversationMessageInput,
  sendConversationMessageSchema,
} from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { ScrollTextIcon, SendHorizontalIcon } from "lucide-react";
import useConversationMessages from "../hooks/use-conversation-messages";
import UserAvatar from "@/features/users/components/user-avatar";
import { useGetConversation } from "../hooks/use-get-conversation";
import ConversationMessage from "../components/conversation-message";
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import ConversationTypingIndicator from "../components/conversation-typing-indicator";

function NoMoreMessages() {
  return (
    <EmptyState>
      <EmptyStateIcon Icon={ScrollTextIcon} />
      <EmptyStateTitle>No more messages</EmptyStateTitle>
      <EmptyStateDescription>You're all caught up!</EmptyStateDescription>
    </EmptyState>
  );
}

function LoadingSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <Skeleton key={i} className="last:w-[70%] w-full h-10" />
  ));
}

export default function ConversationPage() {
  const { mutate, isPending: isSendingMessage } = useSendConversationMessage();

  const { conversationId } = useParams<{ conversationId: string }>();

  const {
    data: messages,
    hasNextPage,
    fetchNextPage,
    isPending,
  } = useConversationMessages(conversationId!);

  const { data: conversation } = useGetConversation(conversationId!);

  const form = useForm<SendConversationMessageInput>({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(sendConversationMessageSchema),
  });

  if (!conversationId) {
    return <Navigate to="/conversations" />;
  }

  function handleSubmit(data: SendConversationMessageInput) {
    mutate({ conversationId: conversationId as string, data });
    form.reset();
    form.setFocus("content");
  }

  return (
    <div className="h-full flex-1 flex flex-col">
      <header className="flex items-center p-5">
        {conversation ? (
          <>
            {conversation && (
              <UserAvatar user={conversation.friend} withStatus />
            )}
            <h1 className="ml-3">{conversation.friend.name}</h1>
          </>
        ) : (
          <>
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="max-w-[300px] w-full h-10" />
          </>
        )}
      </header>
      <div
        id="scrollable-div"
        className="overflow-y-auto flex-1 flex-col-reverse flex max-h-[calc(100svh-14.25rem)] sm:max-h-none"
      >
        {isPending ? (
          <div className="flex flex-col gap-5 p-5">
            <LoadingSkeleton />
          </div>
        ) : (
          <InfiniteScroll
            dataLength={messages?.length || 0}
            loader={<LoadingSkeleton />}
            next={fetchNextPage}
            hasMore={hasNextPage}
            endMessage={<NoMoreMessages />}
            scrollableTarget="scrollable-div"
            className="flex-col-reverse flex gap-5 p-5"
            inverse
          >
            {messages?.map((message) => (
              <ConversationMessage key={message.id} message={message} />
            ))}
          </InfiniteScroll>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex items-center gap-5 p-5 relative"
        >
          {conversation && (
            <ConversationTypingIndicator
              user={conversation.friend}
              conversationId={conversation.id}
              message={form.watch("content")}
              className="absolute -top-5 left-5"
            />
          )}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormControl>
                <Input
                  autoComplete="off"
                  {...field}
                  placeholder="Type a message..."
                />
              </FormControl>
            )}
          />
          <AsyncButton
            isLoading={isSendingMessage}
            type="submit"
            size="icon"
            className="shrink-0"
          >
            <SendHorizontalIcon className="w-[1rem] h-[1rem]" />
          </AsyncButton>
        </form>
      </Form>
    </div>
  );
}
