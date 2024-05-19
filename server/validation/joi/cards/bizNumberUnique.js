import Joi from "joi";

const bizNumberSchema = Joi.object({
  bizNumber: Joi.number()
    .integer()
    .min(1000000)
    .max(9999999)
    .required()
    .messages({
      "number.base": `bizNumber needs to have 7 figures.`,
      "number.integer": `bizNumber needs to have 7 figures.`,
      "number.min": `bizNumber needs to have 7 figures.`,
      "number.max": `bizNumber needs to have 7 figures.`,
      "any.required": `bizNumber needs to have 7 figures.`,
    }),
});

export default bizNumberSchema;
