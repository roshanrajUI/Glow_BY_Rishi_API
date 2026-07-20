import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export class Validation {
  public static run(schema: Joi.Schema, query: "body" | "query" | "params") {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error, value } = schema.validate(req[query], {
        abortEarly: false,
        stripUnknown: true,
      });

      if (!error) {
        req[query] = value;
        return next();
      }

      const message = error.details.map((err) => err.message);
      return res.status(422).json({
        error: message,
      });
    };
  }
}
