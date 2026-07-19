import express from "express";
import path from "path";
import SwaggerMiddlewareConfig from "./middlewares/swagger";
import dbConfig from "./config/db.config";
import myWorkRouter from "./routers/my-work.router";
import myServicesRouter from "./routers/my-services.router";
import bookingRouter from "./routers/bookings.router";
import categoryRouter from "./routers/category.router";
import clientRouter from "./routers/client.router";
import { CorsMiddleware } from "./middlewares/cors.middleware";
import { GlobalErrorHandling } from "./middlewares/globalErrHandling";

const app = express();

app.use(express.json());
app.use(express.static("public"));
SwaggerMiddlewareConfig.setUp(app);
CorsMiddleware.setup(app);

/* Serve swagger.json */
app.get("/swagger.json", express.static(path.resolve(process.cwd(), "public")));

// app.use("/api/auth", authRouter);
app.use("/api/services", myServicesRouter);
app.use("/api/my-works", myWorkRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/clients", clientRouter);

// app.use("/api", AuthMiddleware.setup(), mainRouter);

//handle err globally
app.use(GlobalErrorHandling.setUp());
/* Setup Swagger */

dbConfig
  .initialize()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Failed to initialize the db", err);
  });
