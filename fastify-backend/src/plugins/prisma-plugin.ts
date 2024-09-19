import { PrismaClient } from "@prisma/client";
import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";

declare module "fastify" {
  export interface FastifyInstance {
    db: PrismaClient;
  }
}

interface PrismaPluginOptions {}

const ConnectPrisma: FastifyPluginAsync<PrismaPluginOptions> = async (
  fastify,
  options
) => {
  try {
    fastify.log.info("Connecting to Prisma");
    const client = new PrismaClient();
    fastify.decorate("db", client);
  } catch (error) {
    fastify.log.error(error);
  }
};

export default fastifyPlugin(ConnectPrisma);
