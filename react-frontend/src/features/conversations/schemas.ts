import { z } from "zod";

export const sendConversationMessageSchema = z.object({
  content: z.string().min(1),
});

export type SendConversationMessageInput = z.infer<
  typeof sendConversationMessageSchema
>;
