declare interface User {
  id: string;
  name: string;
  email: string;
  onboardingCompleted: boolean;
  photo?: Image;
}

declare interface Image {
  id: string;
  name: string;
  url: string;
}

declare type UserStatus = "online" | "offline";

declare interface FriendshipRequestReceived {
  id: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  fromUser: User;
}

declare interface FriendshipRequestSent {
  id: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  toUser: User;
}

declare interface FriendshipRequest {
  id: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  fromUser: User;
  toUser: User;
}

declare interface Conversation {
  id: string;
  friend: User;
  messages: ConversationMessage[];
}

declare interface ConversationTyping {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

declare interface ConversationMessage {
  id: string;
  conversationId: string;
  content: string;
  createdAt: Date;
  user: User;
  reactions: MessageReaction[];
  queryStatus?: "pending" | "error";
}

declare interface MessageReaction {
  id: string;
  user: User;
  unicode: string;
  createdAt: Date;
}
