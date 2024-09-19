import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { z } from "zod";

const onboardingSchema = z.object({
  name: z.string().min(2).max(255),
});

const plugin: FastifyPluginAsync = async (fastify, options) => {
  fastify.post("/users/onboarding", async (request, reply) => {
    const { name } = fastify.validate(onboardingSchema, request.body);

    const currentUser = request.user;

    if (currentUser.onboardingCompleted) {
      reply.status(400).send({
        message: "Onboarding already completed",
      });
      return;
    }

    await fastify.db.user.update({
      where: {
        id: request.user.id,
      },
      data: {
        name,
        onboardingCompleted: true,
      },
    });

    // todo get photo

    reply.status(204).send();
  });
};

const OnboardingPlugin = fastifyPlugin(plugin);

export default OnboardingPlugin;
