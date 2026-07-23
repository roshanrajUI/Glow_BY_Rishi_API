import express from "express";
import path from "path";
import SwaggerMiddlewareConfig from "./middlewares/swagger";
import dbConfig from "./config/db.config";
import { CorsMiddleware } from "./middlewares/cors.middleware";
import { GlobalErrorHandling } from "./middlewares/globalErrHandling";
import { Container } from "typedi";
import { DataSource } from "typeorm";

const app = express();

async function startServer() {
  try {
    // 1. Initialize database
    await dbConfig.initialize();

    // 2. Register DataSource in TypeDI
    Container.set(DataSource, dbConfig);

    // 3. Import routers only AFTER DataSource is registered
    const { default: myWorkRouter } = await import("./routers/my-work.router");

    const { default: myServicesRouter } =
      await import("./routers/my-services.router");

    const { default: bookingRouter } =
      await import("./routers/bookings.router");

    const { default: categoryRouter } =
      await import("./routers/category.router");

    const { default: clientRouter } = await import("./routers/client.router");

    // Middleware
    app.use(express.json());
    app.use(express.static("public"));

    SwaggerMiddlewareConfig.setUp(app);
    CorsMiddleware.setup(app);

    // Swagger JSON
    app.get(
      "/swagger.json",
      express.static(path.resolve(process.cwd(), "public")),
    );

    // Routes
    app.use("/api/services", myServicesRouter);
    app.use("/api/my-works", myWorkRouter);
    app.use("/api/bookings", bookingRouter);
    app.use("/api/categories", categoryRouter);
    app.use("/api/clients", clientRouter);

    // Global error handling
    app.use(GlobalErrorHandling.setUp());

    // Start server
    app.listen(3000, () => {
      console.log("Database connected successfully");
      console.log("Server running on port 3000");
    });
  } catch (err) {
    console.log("Failed to initialize the application:", err);
  }
}

startServer();
