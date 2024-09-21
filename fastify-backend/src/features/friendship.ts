import { User } from "@prisma/client";
import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { request } from "http";
import { z } from "zod";

const sendFriendshipRequestSchema = z.object({
  friendId: z.string(),
});

const approveFriendshipParamsSchema = z.object({
  requestId: z.string(),
});

const plugin: FastifyPluginAsync = async (fastify) => {
  try {
    fastify.post("/friendships/requests", async (request, reply) => {
      const { friendId } = fastify.validate(
        sendFriendshipRequestSchema,
        request.body
      );

      const friend = await fastify.db.user.findUnique({
        where: { id: friendId },
      });

      if (!friend) {
        reply.status(404).send({ message: "Friend not found" });
        return;
      }

      const existingFriendRequest =
        await fastify.db.friendshipRequest.findFirst({
          where: {
            fromUserId: request.user.id,
            toUserId: friend.id,
          },
        });

      if (existingFriendRequest) {
        reply.status(400).send({ message: "Friendship request already sent" });
        return;
      }

      const existingFriendship = await fastify.db.friendship.findFirst({
        where: {
          OR: [
            { user1Id: request.user.id, user2Id: friend.id },
            { user1Id: friend.id, user2Id: request.user.id },
          ],
        },
      });

      if (existingFriendship) {
        reply.status(400).send({ message: "Friendship already exists" });
        return;
      }

      const simetricFriendshipRequest =
        await fastify.db.friendshipRequest.findFirst({
          where: {
            fromUserId: friend.id,
            toUserId: request.user.id,
          },
        });

      if (simetricFriendshipRequest) {
        await fastify.db.friendship.create({
          data: {
            user1: { connect: { id: request.user.id } },
            user2: { connect: { id: friend.id } },
          },
        });

        const friendshipRequestUpdated =
          await fastify.db.friendshipRequest.update({
            where: { id: simetricFriendshipRequest.id },
            data: { status: "accepted" },
            include: { toUser: true },
          });

        fastify.socket
          .to(`user:${friend.id}`)
          .emit("friendship-request-accepted", friendshipRequestUpdated);

        reply.status(204).send();
        return;
      }

      const friendshipRequest = await fastify.db.friendshipRequest.create({
        data: {
          fromUser: { connect: { id: request.user.id } },
          toUser: { connect: { id: friend.id } },
        },
        include: { toUser: true, fromUser: true },
      });

      fastify.socket
        .to(`user:${friend.id}`)
        .emit("friendship-request", friendshipRequest);

      reply.send(friendshipRequest);
    });

    fastify.get("/friendships/requests", async (request, reply) => {
      const friendshipRequests = await fastify.db.friendshipRequest.findMany({
        where: { toUserId: request.user.id, status: "pending" },
        include: { fromUser: true },
        orderBy: { createdAt: "desc" },
      });

      reply.send(friendshipRequests);
    });

    fastify.get("/friendships/requests/sent", async (request, reply) => {
      const friendshipRequests = await fastify.db.friendshipRequest.findMany({
        where: { fromUserId: request.user.id },
        include: { toUser: true },
        orderBy: { createdAt: "desc" },
      });

      reply.send(friendshipRequests);
    });

    fastify.delete(
      "/friendships/requests/:requestId",
      async (request, reply) => {
        const { requestId } = fastify.validate(
          approveFriendshipParamsSchema,
          request.params
        );

        const friendshipRequest = await fastify.db.friendshipRequest.findFirst({
          where: { id: requestId, fromUserId: request.user.id },
        });

        if (!friendshipRequest) {
          reply.status(404).send({ message: "Friendship request not found" });
          return;
        }

        await fastify.db.friendshipRequest.delete({
          where: { id: friendshipRequest.id },
        });

        reply.status(204).send();
      }
    );

    fastify.post(
      "/friendships/requests/:requestId/accept",
      async (request, reply) => {
        const { requestId } = fastify.validate(
          approveFriendshipParamsSchema,
          request.params
        );

        const friendshipRequest = await fastify.db.friendshipRequest.findFirst({
          where: { id: requestId, toUserId: request.user.id },
        });

        if (!friendshipRequest) {
          reply.status(404).send({ message: "Friendship request not found" });
          return;
        }

        await fastify.db.friendship.create({
          data: {
            user1: { connect: { id: friendshipRequest.fromUserId } },
            user2: { connect: { id: friendshipRequest.toUserId } },
          },
        });

        const requestUpdated = await fastify.db.friendshipRequest.update({
          where: { id: friendshipRequest.id },
          data: { status: "accepted" },
          include: { fromUser: true, toUser: true },
        });

        fastify.socket
          .to(`user:${requestUpdated.fromUser.id}`)
          .emit("friendship-request-accepted", requestUpdated);

        reply.send(requestUpdated);
      }
    );

    fastify.post(
      "/friendships/requests/:requestId/reject",
      async (request, reply) => {
        const { requestId } = fastify.validate(
          approveFriendshipParamsSchema,
          request.params
        );

        const friendshipRequest = await fastify.db.friendshipRequest.findFirst({
          where: { id: requestId, toUserId: request.user.id },
          include: { fromUser: true },
        });

        if (!friendshipRequest) {
          reply.status(404).send({ message: "Friendship request not found" });
          return;
        }

        await fastify.db.friendshipRequest.update({
          where: { id: friendshipRequest.id },
          data: { status: "rejected" },
        });

        fastify.socket
          .to(`user:${friendshipRequest.fromUserId}`)
          .emit("friendship-request-rejected", friendshipRequest);

        reply.status(204).send();
      }
    );

    fastify.get("/friendships", async (request, reply) => {
      fastify.log.info("Getting friends");

      const friends = await fastify.db.friendship.findMany({
        where: {
          OR: [{ user1Id: request.user.id }, { user2Id: request.user.id }],
        },
        include: {
          user1: true,
          user2: true,
        },
      });

      reply.send(
        friends.map((friendship) =>
          friendship.user1Id === request.user.id
            ? friendship.user2
            : friendship.user1
        )
      );
    });
  } catch (error) {
    fastify.log.fatal(error);
  }
};

const FriendshipPlugin = fastifyPlugin(plugin);

export default FriendshipPlugin;
