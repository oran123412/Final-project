import Joi from "joi";

const titleSchema = Joi.object({
  title: Joi.string().min(2).max(256).required(),
});
const subtitleSchema = Joi.object({
  subtitle: Joi.string().min(2).max(256).required(),
});

const validateTitleSchema = (title) => titleSchema.validate(title);
const validateSubtitleSchema = (subtitle) => subtitleSchema.validate(subtitle);

const validateSchema = {
  title: validateTitleSchema,
  subtitle: validateSubtitleSchema,
};

export default validateSchema;
