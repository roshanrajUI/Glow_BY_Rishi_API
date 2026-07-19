import { NextFunction, Request, Response } from "express";
import { ApiError } from "../models/api.erro";

export class GlobalErrorHandling {
  public static setUp() {
    return (err: any, req: Request, res: Response, next: NextFunction) => {
      console.error(err);

      if (err instanceof ApiError) {
        res.status(err.status).send({
          status: err.status,
          errorMessage: err.message,
        });
      }

      return res.status(500).json({
        success: false,
        errorMessage: "Internal Server Error",
      });
    };
  }
}
