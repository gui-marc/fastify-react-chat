import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { createClient } from "redis";

declare module "fastify" {
  interface FastifyInstance {
    cache: ReturnType<typeof createClient>;
  }
}

const plugin: FastifyPluginAsync = async (fastify) => {
  fastify.log.info("[REDIS] - Connecting");

  const redis = createClient({
    url: process.env.REDIS_URL,
  });

  await redis.connect();

  fastify.log.info("[REDIS] - Connected");

  fastify.decorate("cache", redis);

  fastify.addHook("onClose", async () => {
    await redis.disconnect();
    await redis.quit();
  });
};

const RedisPlugin = fastifyPlugin(plugin);

export default RedisPlugin;
