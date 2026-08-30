import Joi from "joi";

export class CreateService {
  public static setup(): Joi.Schema {
    return Joi.object({
      categoryId: Joi.string().required(),
      serviceName: Joi.string().required(),
      price: Joi.number().min(1).required(),
      description: Joi.string().allow(null).allow(""),
      image: Joi.string().required(),
    });
  }
}
