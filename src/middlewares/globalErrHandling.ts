import type { ErrorHandler } from "hono";
import { ApiError } from "../models/api.error";

export class GlobalErrorHandling {
  public static setUp(): ErrorHandler {
    return (err, c) => {
      console.error(err);

      if (err instanceof ApiError) {
        return c.json(
          { status: err.status, errorMessage: err.message },
          err.status as any,
        );
      }

      return c.json(
        { success: false, errorMessage: "Internal Server Error" },
        500,
      );
    };
  }
}
