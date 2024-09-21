import "dotenv/config";

import Fastify from "fastify";
import cors from "@fastify/cors";

// import PrismaPlugin from "./plugins/prisma-plugin";
// import AuthenticationPlugin from "./features/authentication";
// import ZodValidatorPlugin from "./features/zod-validator";
// import FriendshipPlugin from "./features/friendship";
// import UsersPlugin from "./features/users";
// import RedisPlugin from "./plugins/redis-plugin";
// import SocketPlugin from "./plugins/socket-plugin";

// const PORT = process.env.PORT || 3000;

// const envToLogger = {
//   development: {
//     transport: {
//       target: "pino-pretty",
//       options: {
//         translateTime: "HH:MM:ss Z",
//         ignore: "pid,hostname",
//       },
//     },
//   },
//   production: true,
//   test: false,
// };

// const fastify = Fastify({
//   logger: envToLogger[process.env.NODE_ENV as keyof typeof envToLogger] ?? true,
// });

// fastify.register(cors, {
//   origin: ["http://localhost:5173", "https://fastify-react-chat.vercel.app"],
//   allowedHeaders: ["Authorization", "Content-Type", "Cache-Control"],
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
// });
// fastify.register(PrismaPlugin);
// fastify.register(RedisPlugin);
// fastify.register(SocketPlugin);
// fastify.register(ZodValidatorPlugin);
// fastify.register(AuthenticationPlugin);
// fastify.register(FriendshipPlugin);
// fastify.register(UsersPlugin);

// const start = async () => {
//   try {
//     await fastify.listen({ port: PORT as number });
//   } catch (err) {
//     fastify.log.error(err);
//     process.exit(1);
//   }
// };

// start();

const PORT = process.env.PORT || 3000;

const fastify = Fastify({
  logger: true,
});

fastify.register(cors, {
  origin: ["http://localhost:5173", "https://fastify-react-chat.vercel.app"],
  allowedHeaders: ["Authorization", "Content-Type", "Cache-Control"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

fastify.get("/", async () => {
  return { hello: "world" };
});

const start = async () => {
  try {
    await fastify.listen({ port: PORT as number, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
