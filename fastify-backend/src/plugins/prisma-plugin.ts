import { PrismaClient } from "@prisma/client";
import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";

declare module "fastify" {
  export interface FastifyInstance {
    db: PrismaClient;
  }
}

const ConnectPrisma: FastifyPluginAsync = async (fastify) => {
  try {
    fastify.log.info("[PRISMA] - Connecting");
    const client = new PrismaClient();
    await client.$connect();
    fastify.log.info("[PRISMA] - Connected");
    fastify.decorate("db", client);
  } catch (error) {
    fastify.log.error(error);
  }
};

export default fastifyPlugin(ConnectPrisma);
