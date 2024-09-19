import { User } from "@prisma/client";
import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";

declare module "fastify" {
  interface FastifyRequest {
    user: User;
  }
}

const plugin: FastifyPluginAsync = async (fastify) => {
  fastify.post("/auth/send-passcode", async (request, reply) => {
    const { email } = request.body as { email: string };

    const passcode = await fastify.db.sigInPasscode.create({
      data: {
        expiresAt: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes,
        // 6 digit random number
        value: Math.floor(100000 + Math.random() * 900000),
        user: {
          connectOrCreate: {
            where: { email },
            create: { email },
          },
        },
      },
    });

    fastify.log.info(`Sending passcode to ${email} - ${passcode.value}`);

    // Send passcode to user

    reply.status(204).send();
  });

  fastify.post("/auth/verify-passcode", async (request, reply) => {
    const { email, passcode } = request.body as {
      email: string;
      passcode: string;
    };

    const passcodeRecord = await fastify.db.sigInPasscode.findFirst({
      where: {
        value: parseInt(passcode),
        expiresAt: {
          gte: new Date(),
        },
        user: {
          email,
        },
      },
    });

    if (!passcodeRecord) {
      reply.status(401).send();
      return;
    }

    const session = await fastify.db.session.create({
      data: {
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
        user: {
          connect: {
            email,
          },
        },
      },
    });

    await fastify.db.sigInPasscode.delete({
      where: {
        id: passcodeRecord.id,
      },
    });

    reply.status(200).send({ token: session.id });
  });

  fastify.get("/auth/me", async (request, reply) => {
    reply.send(request.user);
  });

  // middleware
  fastify.addHook("preHandler", async (request, reply) => {
    // if route is protected
    const publicRoutes = ["/auth/send-passcode", "/auth/verify-passcode"];

    if (publicRoutes.includes(request.url)) {
      return;
    }

    // check for Authorization header
    const header = request.headers["authorization"];

    if (!header) {
      reply.status(401).send();
      return;
    }

    const token = header.replace("Bearer ", "");

    // check if token is valid
    const session = await fastify.db.session.findUnique({
      where: {
        id: token,
        expiresAt: {
          gte: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      reply.status(401).send();
      return;
    }

    // attach user to request
    request.user = session.user;
  });
};

const AuthenticationPlugin = fastifyPlugin(plugin);

export default AuthenticationPlugin;
