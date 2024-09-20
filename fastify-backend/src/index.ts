import "dotenv/config";

import Fastify from "fastify";
import cors from "@fastify/cors";

import PrismaPlugin from "./plugins/prisma-plugin";
import AuthenticationPlugin from "./features/authentication";
import ZodValidatorPlugin from "./features/zod-validator";

const PORT = process.env.PORT || 3000;

const envToLogger = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: true,
  test: false,
};

const fastify = Fastify({
  logger: envToLogger[process.env.NODE_ENV as keyof typeof envToLogger] ?? true,
});

fastify.register(PrismaPlugin);
fastify.register(ZodValidatorPlugin);
fastify.register(AuthenticationPlugin);
fastify.register(cors, {
  origin: ["http://localhost:5173"],
});

const start = async () => {
  try {
    await fastify.listen({ port: PORT as number });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
