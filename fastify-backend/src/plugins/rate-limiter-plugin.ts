import fastifyPlugin from "fastify-plugin";
import rateLimiter from "@fastify/rate-limit";

import { redis } from "./redis-plugin";

const RateLimiterPlugin = fastifyPlugin(async (fastify) => {
  fastify.register(rateLimiter, {
    global: true,
    max: 200,
    timeWindow: "1 minute",
    addHeadersOnExceeding: {
      "x-ratelimit-limit": true,
      "x-ratelimit-remaining": true,
      "x-ratelimit-reset": true,
    },
    addHeaders: {
      "x-ratelimit-limit": true,
      "x-ratelimit-remaining": true,
      "x-ratelimit-reset": true,
    },
  });
});

export default RateLimiterPlugin;
