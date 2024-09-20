import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { request } from "http";
import { z } from "zod";

const getUsersSearchSchema = z.object({
  search: z
    .string()
    .optional()
    .transform((v) => v?.trim()),
  take: z.coerce.number().int().min(1).max(20).default(5),
});

const plugin: FastifyPluginAsync = async (fastify) => {
  fastify.get("/users", async (request, reply) => {
    const { search, take } = fastify.validate(
      getUsersSearchSchema,
      request.query
    );

    if (!search) {
      reply.send([]);
      return;
    }

    const users = await fastify.db.user.findMany({
      where: {
        OR: [
          { name: { contains: search }, id: { not: request.user.id } },
          { email: { contains: search }, id: { not: request.user.id } },
        ],
      },
      take,
    });

    reply.send(users);
  });
};

const UsersPlugin = fastifyPlugin(plugin);

export default UsersPlugin;
