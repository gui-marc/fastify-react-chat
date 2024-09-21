import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";

const plugin: FastifyPluginAsync = async (fastify) => {
  try {
    fastify.get("/health", async (request, reply) => {
      reply.send({ status: "ok" });
    });
  } catch (error) {
    fastify.log.fatal(error);
  }
};

const HealthCheckPlugin = fastifyPlugin(plugin);

export default HealthCheckPlugin;
