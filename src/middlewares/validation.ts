import type Joi from "joi";
import { ApiError } from "../models/api.error";

export class Validation {
  /**
   * Validates `data` against a Joi schema and returns the sanitized value.
   * Throws an ApiError(422) on failure, handled centrally by
   * GlobalErrorHandling (replaces the old Express middleware that ran
   * before each route handler).
   */
  public static validate<T>(schema: Joi.Schema, data: unknown): T {
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details.map((err) => err.message).join(", ");
      throw new ApiError(422, message);
    }

    return value as T;
  }
}
