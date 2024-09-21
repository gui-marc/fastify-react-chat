import { client } from "@/api/client";
import { SendFriendRequestInput } from "./schemas";

const BASE_URL = "/friendships";

export async function getFriends() {
  const response = await client.get<User[]>(`${BASE_URL}`);
  return response.data;
}

export async function sendFriendRequest(data: SendFriendRequestInput) {
  const response = await client.post<FriendshipRequestSent>(
    `${BASE_URL}/requests`,
    data
  );
  return response.data;
}

export async function acceptFriendRequest(requestId: string) {
  const response = await client.post<FriendshipRequestReceived>(
    `${BASE_URL}/requests/${requestId}/accept`
  );
  return response.data;
}

export async function rejectFriendRequest(requestId: string) {
  const response = await client.post(
    `${BASE_URL}/requests/${requestId}/reject`
  );
  return response.data;
}

export async function cancelFriendRequest(requestId: string) {
  const response = await client.delete(`${BASE_URL}/requests/${requestId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await client.get<FriendshipRequestReceived[]>(
    `${BASE_URL}/requests`
  );
  return response.data;
}

export async function getFriendRequestsSent() {
  const response = await client.get<FriendshipRequestSent[]>(
    `${BASE_URL}/requests/sent`
  );
  return response.data;
}
