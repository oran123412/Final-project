import Joi from "joi";

const checkIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const checkIdValidation = (id) => {
  return checkIdSchema.validateAsync({ id });
};
export default checkIdValidation;
