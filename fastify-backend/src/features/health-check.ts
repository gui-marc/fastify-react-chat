import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";

const plugin: FastifyPluginAsync = async (fastify) => {
  fastify.get("/health", async (request, reply) => {
    reply.send({ status: "ok" });
  });
};

const HealthCheckPlugin = fastifyPlugin(plugin);

export default HealthCheckPlugin;
