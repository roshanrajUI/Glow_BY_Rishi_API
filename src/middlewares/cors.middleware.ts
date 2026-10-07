import type { MiddlewareHandler } from "hono";

const allowOrigins = [
  "http://localhost:4200",
  "http://localhost:8000",
  "https://glowbyrishi.in",
  "https://www.glowbyrishi.in",
  "https://glow-by-rishi-ui.onrender.com",
];

function isAllowedOrigin(origin: string): boolean {
  if (allowOrigins.includes(origin)) {
    return true;
  }
  return /^https:\/\/[a-z0-9-]+\.pages\.dev$/i.test(origin);
}

export const CorsMiddleware: MiddlewareHandler = async (c, next) => {
  const origin = c.req.header("Origin");
  if (origin && isAllowedOrigin(origin)) {
    c.header("Access-Control-Allow-Origin", origin);
    c.header("Vary", "Origin");
  }
  c.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  c.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, token, Authorization",
  );

  if (c.req.method === "OPTIONS") {
    return c.body(null, 200);
  }

  await next();
};
