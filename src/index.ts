import { Hono } from "hono";
import { AppBindings } from "./types";
import { CorsMiddleware } from "./middlewares/cors.middleware";
import { GlobalErrorHandling } from "./middlewares/globalErrHandling";
import categoryRouter from "./routers/category.router";
import myServicesRouter from "./routers/my-services.router";
import myWorkRouter from "./routers/my-work.router";
import bookingRouter from "./routers/bookings.router";
import clientRouter from "./routers/client.router";
import AuthController from "./controllers/auth.controller";

const app = new Hono<{ Bindings: AppBindings }>();

app.use("*", CorsMiddleware);

app.get("/api/health", (c) => c.json({ status: "ok" }));

// Serve R2-stored images at the same relative path the original Express app
// served them from disk (`/api/uploads/<folder>/<filename>`).
app.get("/api/uploads/:folder/:filename", async (c) => {
  const { folder, filename } = c.req.param();
  const object = await c.env.UPLOADS.get(`${folder}/${filename}`);
  if (!object) {
    return c.notFound();
  }
  return new Response(object.body, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
});

app.post("/api/auth/register", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const result = await new AuthController().createUser(body);
  return c.json(result, 200);
});

app.route("/api/services", myServicesRouter);
app.route("/api/my-works", myWorkRouter);
app.route("/api/bookings", bookingRouter);
app.route("/api/categories", categoryRouter);
app.route("/api/clients", clientRouter);

app.onError(GlobalErrorHandling.setUp());

export default app;
