import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { z } from "zod";

const getUsersSearchSchema = z.object({
  search: z
    .string()
    .optional()
    .transform((v) => v?.trim()),
  take: z.coerce.number().int().min(1).max(20).default(5),
});

const plugin: FastifyPluginAsync = async (fastify) => {
  try {
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
            {
              name: { contains: search },
              id: { not: request.user.id },
              onboardingCompleted: true,
            },
            {
              email: { contains: search },
              id: { not: request.user.id },
              onboardingCompleted: true,
            },
          ],
        },
        take,
      });

      reply.send(users);
    });
  } catch (error) {
    fastify.log.fatal(error);
  }
};

const UsersPlugin = fastifyPlugin(plugin);

export default UsersPlugin;
