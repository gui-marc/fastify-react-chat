import fastifyPlugin from "fastify-plugin";
import { z } from "zod";

const conversationIdParamSchema = z.object({
  id: z.string(),
});

const conversationMessageQuerySchema = z.object({
  cursorId: z.string().optional(),
  take: z.coerce.number().int().min(1).max(50).default(20),
});

const startConversationSchema = z.object({
  userId: z.string(),
});

const ConversationsPlugin = fastifyPlugin(async (fastify) => {
  fastify.get("/conversations", async (request, reply) => {
    const friendships = await fastify.db.friendship.findMany({
      where: {
        OR: [
          { user1Id: request.user.id, conversation: { isNot: null } },
          { user2Id: request.user.id, conversation: { isNot: null } },
        ],
      },
      include: {
        user1: true,
        user2: true,
        conversation: {
          include: {
            messages: {
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    reply.send(
      friendships.map((friendship) => {
        const friend =
          friendship.user1Id === request.user.id
            ? friendship.user2
            : friendship.user1;

        return {
          ...friendship.conversation,
          friend,
        };
      })
    );
  });

  fastify.post("/conversations", async (request, reply) => {
    const { userId } = fastify.validate(startConversationSchema, request.body);

    const friend = await fastify.db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!friend) {
      reply.status(404).send({ message: "User not found" });
      return;
    }

    const friendship = await fastify.db.friendship.findFirst({
      where: {
        OR: [
          { user1Id: request.user.id, user2Id: userId },
          { user1Id: userId, user2Id: request.user.id },
        ],
      },
      include: {
        conversation: true,
      },
    });

    if (!friendship) {
      reply
        .status(400)
        .send({ message: `You are not friends with ${friend.name}` });
      return;
    }

    if (friendship.conversation) {
      reply.send(friendship.conversation);
      return;
    }

    const conversation = await fastify.db.conversation.create({
      data: {
        friendship: {
          connect: {
            id: friendship.id,
          },
        },
      },
    });

    reply.send({
      ...conversation,
      friend,
      messages: [],
    });
  });

  fastify.get("/conversations/:id", async (request, reply) => {
    const { id } = fastify.validate(conversationIdParamSchema, request.params);

    const conversation = await fastify.db.conversation.findFirst({
      where: {
        id,
        OR: [
          { friendship: { user1Id: request.user.id } },
          { friendship: { user2Id: request.user.id } },
        ],
      },
      include: {
        friendship: {
          include: {
            user1: true,
            user2: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          include: {
            user: true,
            reactions: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      reply.status(404).send({ message: "Conversation not found" });
      return;
    }

    const friend =
      conversation?.friendship.user1Id === request.user.id
        ? conversation.friendship.user2
        : conversation.friendship.user1;

    reply.send({ ...conversation, friend });
  });

  fastify.get("/conversations/:id/messages", async (request, reply) => {
    const { id } = fastify.validate(conversationIdParamSchema, request.params);
    const { cursorId, take } = fastify.validate(
      conversationMessageQuerySchema,
      request.query
    );

    const conversation = await fastify.db.conversation.findFirst({
      where: {
        id,
        OR: [
          { friendship: { user1Id: request.user.id } },
          { friendship: { user2Id: request.user.id } },
        ],
      },
      include: {
        messages: {
          cursor: cursorId ? { id: cursorId } : undefined,
          skip: cursorId ? 1 : 0,
          orderBy: {
            createdAt: "desc",
          },
          take,
          include: {
            user: true,
            reactions: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      reply.status(404).send({ message: "Conversation not found" });
      return;
    }

    reply.send(conversation.messages);
  });

  fastify.post("/conversations/:id/messages", async (request, reply) => {
    const { id } = fastify.validate(conversationIdParamSchema, request.params);
    const { content } = fastify.validate(
      z.object({
        content: z.string().min(1).max(500),
      }),
      request.body
    );

    const conversation = await fastify.db.conversation.findFirst({
      where: {
        id,
        OR: [
          { friendship: { user1Id: request.user.id } },
          { friendship: { user2Id: request.user.id } },
        ],
      },
    });

    if (!conversation) {
      reply.status(404).send({ message: "Conversation not found" });
      return;
    }

    const message = await fastify.db.message.create({
      data: {
        content,
        user: {
          connect: {
            id: request.user.id,
          },
        },
        conversation: {
          connect: {
            id,
          },
        },
      },
      include: {
        user: true,
        reactions: {
          include: {
            user: true,
          },
        },
      },
    });

    fastify.socket
      .to(`conversation:${id}`)
      .emit("conversation-message", message);

    reply.send(message);
  });
});

export default ConversationsPlugin;
