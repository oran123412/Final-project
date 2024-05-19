import Joi from "joi";
import phoneRegex from "../../../utils/phoneRegex.js";

const editIsBizzSchema = Joi.object({
  name: Joi.object()
    .keys({
      first: Joi.string().min(2).max(256).required(),
      middle: Joi.string().min(2).max(256).allow(""),
      last: Joi.string().min(2).max(256).required(),
    })
    .required(),
  phone: Joi.string().pattern(phoneRegex).required(),
  image: Joi.object().keys({
    url: Joi.string()
      .uri({ scheme: ["http", "https"] })
      .allow(""),
    alt: Joi.string().min(2).max(256).allow("").when("url", {
      is: Joi.exist(),
      then: Joi.required(),
    }),
  }),
  address: Joi.object()
    .keys({
      state: Joi.string().min(2).max(256).allow(""),
      country: Joi.string().min(2).max(256).required(),
      city: Joi.string().min(2).max(256).required(),
      street: Joi.string().min(2).max(256).required(),
      houseNumber: Joi.number().min(2).max(256).required(),
      zip: Joi.string()
        .pattern(/^[0-9a-zA-Z\- ]{2,256}$/)
        .required(),
    })
    .required(),
  isBusiness: Joi.boolean().required(),
});

const editIsBizzSchemaValidation = (userInput) => {
  return editIsBizzSchema.validateAsync(userInput);
};

export default editIsBizzSchemaValidation;
