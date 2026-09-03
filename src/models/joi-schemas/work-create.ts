import Joi from "joi";

export class CreateMyWork {
  public static setUp(): Joi.Schema {
    return Joi.object({
      serviceId: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().allow(null).allow(""),
      imageUrl: Joi.string().allow(null, "").uri(),
    });
  }
}
