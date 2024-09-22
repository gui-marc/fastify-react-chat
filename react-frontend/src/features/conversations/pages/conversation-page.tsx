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
import { SendHorizontalIcon } from "lucide-react";
import useConversationMessages from "../hooks/use-conversation-messages";
import UserAvatar from "@/features/users/components/user-avatar";
import { useGetConversation } from "../hooks/use-get-conversation";

export default function ConversationPage() {
  const { mutate, isPending } = useSendConversationMessage();

  const { conversationId } = useParams<{ conversationId: string }>();

  const {
    data: messages,
    hasNextPage,
    fetchNextPage,
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
  }

  return (
    <div className="h-full flex-1 p-5 flex flex-col">
      <header className="flex items-center">
        {conversation && <UserAvatar user={conversation?.friend} withStatus />}
        <h1 className="ml-3">{conversation?.friend.name}</h1>
      </header>
      <div
        id="scrollable-div"
        className="overflow-y-auto flex-1 flex-col-reverse flex"
      >
        <InfiniteScroll
          dataLength={messages?.length || 0}
          loader={<>Loading...</>}
          next={fetchNextPage}
          hasMore={hasNextPage}
          endMessage={<>No more messages</>}
          scrollableTarget="scrollable-div"
          className="flex-col-reverse flex p-5"
          inverse
        >
          {messages?.map((message) => (
            <div key={message.id}>{message.content}</div>
          ))}
        </InfiniteScroll>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex items-center gap-5"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormControl>
                <Input {...field} placeholder="Type a message..." />
              </FormControl>
            )}
          />
          <AsyncButton
            isLoading={isPending}
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
