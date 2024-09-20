import { z } from "zod";

export const sendFriendRequestSchema = z.object({
  friendId: z.string(),
});

export type SendFriendRequestInput = z.infer<typeof sendFriendRequestSchema>;
