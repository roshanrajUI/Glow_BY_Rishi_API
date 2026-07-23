import Joi from "joi";

export class BookingCreate {
  public static setUp(): Joi.Schema {
    return Joi.object({
      bookingDate: Joi.date().required(),
      bookingTime: Joi.date().required(),
      location: Joi.string().required(),
      totalPrice: Joi.number().required,
      clientName: Joi.string().required(),
      phoneNumber: Joi.string().required(),
      gmail: Joi.string().allow(null).allow(""),
      description: Joi.string().allow(null).allow(""),
    });
  }
}
