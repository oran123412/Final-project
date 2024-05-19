import Joi from "joi";

const objectIdSchema = Joi.object({
  id: Joi.string().hex().required(),
});

const validateObjectIdSchema = (id) => {
  return objectIdSchema.validateAsync({ id });
};

export default validateObjectIdSchema;
