import Joi from "joi";

export class CreateReview {
  public static setUp(): Joi.Schema {
    return Joi.object().keys({
      bookingNumber: Joi.string().required(),
      clientNumber: Joi.string().required(),
      rating: Joi.number().required(),
      review: Joi.string().allow(null).allow(""),
    });
  }
}
