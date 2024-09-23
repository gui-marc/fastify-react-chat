import PasscodeEmail from "../emails/passcode-email";
import { Session, User } from "@prisma/client";
import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { z } from "zod";

declare module "fastify" {
  interface FastifyRequest {
    user: User;
    sessionId: string;
  }
}

const onboardingSchema = z.object({
  name: z.string().min(2).max(255),
});

const sendPasscodeSchema = z.object({
  email: z.string().email(),
});

const verifyPasscodeSchema = z.object({
  email: z.string().email(),
  passcode: z.string().length(6),
});

const plugin: FastifyPluginAsync = async (fastify) => {
  try {
    fastify.post(
      "/auth/send-passcode",
      {
        config: {
          rateLimit: {
            max: 5,
            timeWindow: "1 minute",
          },
        },
      },
      async (request, reply) => {
        const { email } = fastify.validate(sendPasscodeSchema, request.body);

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

        await fastify.mailer.sendEmail({
          to: email,
          subject: "Sign in passcode",
          component: PasscodeEmail({ passcode: passcode.value }),
        });

        reply.status(204).send();
      }
    );

    fastify.post(
      "/auth/verify-passcode",
      {
        config: {
          rateLimit: {
            max: 5,
            timeWindow: "1 minute",
          },
        },
      },
      async (request, reply) => {
        const { email, passcode } = fastify.validate(
          verifyPasscodeSchema,
          request.body
        );

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
      }
    );

    fastify.get("/auth/me", async (request, reply) => {
      reply.send(request.user);
    });

    fastify.post("/auth/logout", async (request, reply) => {
      await fastify.db.session.delete({
        where: {
          id: request.sessionId,
        },
      });

      await fastify.cache.del(`session:${request.sessionId}`);

      reply.status(204).send();
    });

    fastify.post("/auth/onboarding", async (request, reply) => {
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

      await fastify.cache.del(`session:${request.sessionId}`);

      // todo get photo

      reply.status(204).send();
    });

    // middleware
    fastify.addHook("preHandler", async (request, reply) => {
      // if route is protected
      const publicRoutes = [
        "/auth/send-passcode",
        "/auth/verify-passcode",
        "/health",
      ];

      if (
        publicRoutes.includes(request.url) ||
        request.url.startsWith("/socket.io")
      ) {
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
      const cachedSessionStr = await fastify.cache.get(`session:${token}`);

      if (cachedSessionStr) {
        const cachedSession = JSON.parse(cachedSessionStr) as Session & {
          user: User;
        };

        if (cachedSession.expiresAt < new Date()) {
          await fastify.cache.del(`session:${token}`);
          reply.status(401).send();
          return;
        }

        request.user = cachedSession.user;
        request.sessionId = cachedSession.id;
        return;
      }

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

      await fastify.cache.set(`session:${token}`, JSON.stringify(session));

      // attach user to request
      request.user = session.user;
      request.sessionId = session.id;
    });
  } catch (error) {
    fastify.log.fatal(error);
  }
};

const AuthenticationPlugin = fastifyPlugin(plugin);

export default AuthenticationPlugin;
