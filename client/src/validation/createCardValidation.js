import Joi from "joi";

const alphaSpacePattern = /^[a-zA-Z\s]*$/;

const titleSchema = Joi.object({
  title: Joi.string().min(2).max(256).required(),
});

const subtitleSchema = Joi.object({
  subtitle: Joi.string().min(2).max(256).required().messages({
    "any.required": "Subtitle is required",
    "string.empty": "Subtitle should not be empty",
    "string.min": "Subtitle must be at least 2 characters",
    "string.max": "Subtitle must be at most 256 characters",
  }),
});

const descriptionSchema = Joi.object({
  description: Joi.string().min(2).max(256).required(),
});

const phoneSchema = Joi.object({
  phone: Joi.string()
    .length(10)
    .messages({
      "string.length": "Phone number must be exactly 10 digits",
    })
    .pattern(/^05\d{8}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must start with 05 and be followed by 8 digits",
    }),
});

const emailSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .min(5)
    .required(),
});

const webSchema = Joi.object({
  web: Joi.string()
    .uri({
      scheme: ["http", "https"],
    })
    .min(14)
    .max(256)
    .required()
    .messages({
      "string.empty": "Web field can't be empty",
      "string.uri":
        "Web must be a valid URI with a scheme matching the http /https pattern",
      "string.min": "Web field must be at least 14 characters",
      "string.max": "Web field must be at most 256 characters",
    }),
});

const urlSchema = Joi.object({
  url: Joi.string().uri().min(14).max(256).required().messages({
    "string.uri": "URL must be a valid URL",
    "string.min": "URL field must be at least 14 characters",
    "string.max": "URL field must be at most 256 characters",
    "any.required": "URL is required",
  }),
});

const altSchema = Joi.object({
  alt: Joi.string().min(2).max(256).required(),
});

const stateSchema = Joi.object({
  state: Joi.string()
    .pattern(alphaSpacePattern)
    .min(2)
    .max(256)
    .required()
    .messages({
      "string.pattern.base":
        "State must only contain alphabetic characters and spaces",
      "string.min":
        "State code is too short. It must be at least 2 characters long.",
      "string.max":
        "State code is too long. It can be no more than 256 characters.",
    }),
});

const countrySchema = Joi.object({
  country: Joi.string()
    .pattern(alphaSpacePattern)
    .min(2)
    .max(256)
    .required()
    .messages({
      "string.pattern.base":
        "Country must only contain alphabetic characters and spaces",
    }),
});

const citySchema = Joi.object({
  city: Joi.string().min(2).max(256).required(),
});

const streetSchema = Joi.object({
  street: Joi.string()
    .pattern(alphaSpacePattern)
    .min(2)
    .max(256)
    .required()
    .messages({
      "string.pattern.base":
        "Street must only contain alphabetic characters and spaces",
    }),
});

const houseNumberSchema = Joi.object({
  houseNumber: Joi.number().min(1).max(10000).required(),
});

const zipSchema = Joi.object({
  zip: Joi.string()
    .min(2)
    .max(256)
    .pattern(/^[0-9a-zA-Z\- ]{2,256}$/)
    .required()
    .messages({
      "string.base": "Zip code must be a string.",
      "string.empty": "Zip code cannot be empty.",
      "string.min":
        "Zip code is too short. It must be at least 2 characters long.",
      "string.max":
        "Zip code is too long. It can be no more than 256 characters.",
      "string.pattern.base":
        "Zip code can only contain numbers, letters, spaces, and dashes.",
      "any.required": "Zip code is required.",
    }),
});
const priceSchema = Joi.object({
  price: Joi.number().required(),
});

const validateSchema = {
  title: (value) => titleSchema.validate({ title: value }),
  subtitle: (value) => subtitleSchema.validate({ subtitle: value }),
  description: (value) => descriptionSchema.validate({ description: value }),
  phone: (value) => phoneSchema.validate({ phone: value }),
  email: (value) => emailSchema.validate({ email: value }),
  web: (value) => webSchema.validate({ web: value }),
  url: (value) => urlSchema.validate({ url: value }),
  alt: (value) => altSchema.validate({ alt: value }),
  state: (value) => stateSchema.validate({ state: value }),
  country: (value) => countrySchema.validate({ country: value }),
  city: (value) => citySchema.validate({ city: value }),
  street: (value) => streetSchema.validate({ street: value }),
  houseNumber: (value) => houseNumberSchema.validate({ houseNumber: value }),
  zip: (value) => zipSchema.validate({ zip: value }),
  price: (value) => priceSchema.validate({ price: value }),
};

export default validateSchema;
