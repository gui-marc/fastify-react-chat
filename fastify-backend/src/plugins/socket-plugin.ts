import { FriendshipRequest, Session, User } from "@prisma/client";
import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { Server } from "socket.io";

// Receive args and return void
type Emit<T> = (arg: T) => void;

interface ListenEvents {}

interface EmitEvents {
  ["friendship-request"]: Emit<FriendshipRequest>;
  ["friendship-request-accepted"]: Emit<FriendshipRequest>;
  ["friendship-request-rejected"]: Emit<FriendshipRequest>;
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

      console.log("token", token);

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

    fastify.socket.on("connection", (socket) => {
      const user = socket.session.user;
      socket.join(`user:${user.id}`);
      fastify.log.info(`[SOCKET] - Connected ${socket.id} - ${user.email}`);
    });

    fastify.socket.on("disconnect", (socket) => {
      fastify.log.info(`[SOCKET] - Disconnected ${socket.id}`);
    });
  });

  fastify.addHook("onClose", async () => {
    fastify.socket.close();
  });
};

const SocketPlugin = fastifyPlugin(plugin);

export default SocketPlugin;
