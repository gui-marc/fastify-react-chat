import {
  FriendshipRequest,
  Message,
  MessageReaction,
  Session,
  User,
} from "@prisma/client";
import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { Server } from "socket.io";

// Receive args and return void
type Emit<T> = (arg: T) => void;

interface ListenEvents {}

interface EmitEvents {
  // Friendship
  ["friendship-request"]: Emit<FriendshipRequest>;
  ["friendship-request-accepted"]: Emit<FriendshipRequest>;
  ["friendship-request-rejected"]: Emit<FriendshipRequest>;
  // Conversations
  ["conversation-message"]: Emit<Message>;
  ["conversation-message-reaction"]: Emit<MessageReaction>;
  ["conversation-typing"]: Emit<{
    conversationId: string;
    isTyping: boolean;
    userId: string;
  }>;
}

declare module "fastify" {
  interface FastifyInstance {
    socket: Server<ListenEvents, EmitEvents>;
  }
}

declare module "socket.io" {
  interface Socket {
    session: Session & { user: User };
  }
}

const plugin: FastifyPluginAsync = async (fastify) => {
  try {
    const socket = new Server(fastify.server, {
      cors: {
        origin: [
          "http://localhost:5173",
          "https://fastify-react-chat.vercel.app",
        ],
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["Authorization"],
      },
    });

    fastify.decorate("socket", socket);

    fastify.addHook("onListen", async () => {
      fastify.socket.use(async (socket, next) => {
        const token =
          socket.handshake.auth.token ||
          socket.handshake.headers.authorization?.split(" ")[1];

        if (!token) {
          return next(new Error("Authentication error"));
        }

        try {
          const session = await fastify.cache.get(`session:${token}`);

          if (!session) {
            return next(new Error("Authentication error"));
          }

          socket.session = JSON.parse(session) as Session & { user: User };

          if (socket.session.expiresAt < new Date()) {
            await fastify.cache.del(`session:${token}`);
            return next(new Error("Authentication error"));
          }

          return next();
        } catch (error) {
          return next(new Error("Authentication error"));
        }
      });

      fastify.socket.on("connection", async (socket) => {
        const user = socket.session.user;
        socket.join(`user:${user.id}`);

        const conversations = await fastify.db.conversation.findMany({
          where: {
            OR: [
              { friendship: { user1Id: user.id } },
              { friendship: { user2Id: user.id } },
            ],
          },
          select: {
            id: true,
          },
        });

        conversations.forEach((conversation) => {
          socket.join(`conversation:${conversation.id}`);
        });

        fastify.log.info(`[SOCKET] - Connected ${socket.id} - ${user.email}`);
        await fastify.cache.set(`user-status:${user.id}`, "online");

        socket.on("disconnect", () => {
          fastify.log.info(`[SOCKET] - Disconnected ${socket.id}`);
          fastify.cache.set(`user-status:${user.id}`, "offline");
        });
      });
    });

    fastify.addHook("onClose", async () => {
      fastify.socket.close();
    });

    fastify.addHook("preClose", (done) => {
      fastify.socket.disconnectSockets();
      done();
    });
  } catch (error) {
    fastify.log.fatal(error);
  }
};

const SocketPlugin = fastifyPlugin(plugin);

export default SocketPlugin;
