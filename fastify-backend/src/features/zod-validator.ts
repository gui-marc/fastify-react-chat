import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { z } from "zod";

declare module "fastify" {
  interface FastifyInstance {
    validate<T>(schema: z.Schema<T>, data: unknown): T;
  }
}

const plugin: FastifyPluginAsync = async (fastify, options) => {
  try {
    fastify.decorate("validate", (schema, data) => {
      return schema.parse(data);
    });

    // Error handler
    fastify.setErrorHandler((error, request, reply) => {
      if (error instanceof z.ZodError) {
        reply.status(400).send({
          message: "Validation Error",
          errors: error.errors,
        });
      }

      throw error;
    });
  } catch (error) {
    fastify.log.fatal(error);
  }
};

const ZodValidatorPlugin = fastifyPlugin(plugin);

export default ZodValidatorPlugin;
