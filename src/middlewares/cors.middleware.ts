import { Application, NextFunction, Request, Response } from "express";

const allowedOrigins = (req: Request, res: Response, next: NextFunction) => {
  const allowOrigins = [
    "localhost:4200",
    "localhost:8000",
    "http://localhost:4200",
    "http://localhost:8000",
    "http://localhost:8000/api",
    "https://glow-by-rishi-api.onrender.com/api",
    "https://glow-by-rishi-ui.onrender.com",
  ];
  const origin = req.headers.origin!;
  const host = req.headers.host!;
  if (origin && allowOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, token, Authorization",
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
};
export class CorsMiddleware {
  public static setup(express: Application) {
    express.use(allowedOrigins);
  }
}
