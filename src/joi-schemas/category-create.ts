import Joi from "joi";

export class CreateCategory {
  public static setUp(): Joi.Schema {
    return Joi.object().keys({
      categoryName: Joi.string().required(),
      description: Joi.string().allow(null).allow(""),
      isActive: Joi.boolean().default(true).allow(null),
    });
  }
}
