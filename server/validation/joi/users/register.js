import Joi from "joi";
import phoneRegex from "../../../utils/phoneRegex.js";
import passwordRegex from "../../../utils/passwordRegex.js";

const registerSchema = Joi.object({
  name: Joi.object()
    .keys({
      first: Joi.string().min(2).max(256).required(),
      middle: Joi.string().min(2).max(256).allow(""),
      last: Joi.string().min(2).max(256).required(),
    })
    .required(),
  phone: Joi.string().pattern(phoneRegex).required().messages({
    "string.pattern.base":
      "phone must be a standard Israeli phone number,with 9-11 figuers",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .min(5)
    .max(500)
    .required(),
  password: Joi.string()
    .pattern(new RegExp(passwordRegex))
    .min(8)
    .max(20)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase, lowercase, special character(!@#$%^&*-), and number",
    }),
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
      houseNumber: Joi.number().min(10).max(256).required(),
      zip: Joi.string()
        .pattern(/^[0-9a-zA-Z\- ]{2,256}$/)
        .required()
        .messages({
          "string.pattern.base":
            "Zip code must be 2 to 256 characters long and can only contain numbers, letters, spaces, and dashes.",
          "string.empty": "Zip code cannot be empty.",
          "any.required": "Zip code is required.",
        }),
    })
    .required(),
  isBusiness: Joi.boolean().required(),
});

const registerSchemaValidation = (userInput) => {
  return registerSchema.validateAsync(userInput);
};

export default registerSchemaValidation;
