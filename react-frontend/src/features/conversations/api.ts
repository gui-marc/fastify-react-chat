import { client } from "@/api/client";
import { SendConversationMessageInput } from "./schemas";

const BASE_URL = "/conversations";

export async function getConversations() {
  const response = await client.get<Conversation[]>(BASE_URL);
  return response.data;
}

export async function startConversation(userId: string) {
  const response = await client.post<Conversation>(BASE_URL, { userId });
  return response.data;
}

export async function sendConversationMessage({
  conversationId,
  data,
}: {
  conversationId: string;
  data: SendConversationMessageInput;
}) {
  const response = await client.post<ConversationMessage>(
    `${BASE_URL}/${conversationId}/messages`,
    data
  );
  return response.data;
}

export async function getConversationMessages({
  conversationId,
  take = 20,
  cursorId,
}: {
  conversationId: string;
  take?: number;
  cursorId?: string;
}) {
  const response = await client.get<ConversationMessage[]>(
    `${BASE_URL}/${conversationId}/messages`,
    {
      params: { ...(take ? { take } : {}), ...(cursorId ? { cursorId } : {}) },
    }
  );
  return response.data;
}

export async function getConversation(conversationId: string) {
  const response = await client.get<Conversation>(
    `${BASE_URL}/${conversationId}`
  );
  return response.data;
}
