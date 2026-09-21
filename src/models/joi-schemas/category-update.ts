import Joi from "joi";

export class UpdateCategory {
  public static setUp(): Joi.Schema {
    return Joi.object().keys({
      categoryName: Joi.string().required(),
      description: Joi.string().allow(null).allow(""),
      imageUrl: Joi.string().allow(null, "").uri(),
    });
  }
}
