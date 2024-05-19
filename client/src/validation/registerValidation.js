import Joi from "joi";

import { validateEmailLogin, validatePasswordLogin } from "./loginValidation";
const alphaSpacePattern = /^[a-zA-Z\s]*$/;

const firstSchema = Joi.object({
  first: Joi.string()
    .pattern(alphaSpacePattern)
    .min(2)
    .max(256)
    .regex(/^[A-Za-z]+$/)
    .required()
    .messages({
      "string.pattern.base":
        "First must only contain alphabetic characters and spaces",
    }),
});
const lastSchema = Joi.object({
  last: Joi.string()
    .pattern(alphaSpacePattern)
    .min(2)
    .max(256)
    .regex(/^[A-Za-z]+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Last must only contain alphabetic characters and spaces",
    }),
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

const urlSchema = Joi.object({
  url: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .allow("")
    .messages({
      "string.uri":
        "URL must be a valid URI with a scheme matching the 'http' or 'https' pattern",
    }),
});
const countrySchema = Joi.object({
  country: Joi.string()
    .pattern(alphaSpacePattern)
    .min(2)
    .max(256)
    .regex(/^[A-Za-z]+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Country must only contain alphabetic characters and spaces",
    }),
});
const citySchema = Joi.object({
  city: Joi.string()
    .pattern(alphaSpacePattern)
    .min(2)
    .max(256)
    .regex(/^[A-Za-z]+$/)
    .required()
    .messages({
      "string.pattern.base":
        "City must only contain alphabetic characters and spaces",
    }),
});
const streetSchema = Joi.object({
  street: Joi.string()
    .pattern(alphaSpacePattern)
    .min(2)
    .max(256)
    .regex(/^[A-Za-z]+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Street must only contain alphabetic characters and spaces",
    }),
});
const houseNumberSchema = Joi.object({
  houseNumber: Joi.number().min(2).max(256).required(),
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

const validateFirstSchema = (first) => firstSchema.validate(first);
const validatelastSchema = (last) => lastSchema.validate(last);
const validatephoneSchema = (phone) => phoneSchema.validate(phone);
const validateUrlSchema = (url) => urlSchema.validate(url);
const validatecountrySchema = (country) => countrySchema.validate(country);
const validatecitySchema = (city) => citySchema.validate(city);
const validatestreetSchema = (street) => streetSchema.validate(street);
const validatehouseNumberSchema = (houseNumber) =>
  houseNumberSchema.validate(houseNumber);
const validateZipSchema = (zip) => zipSchema.validate(zip);

const validateSchema = {
  first: validateFirstSchema,
  email: validateEmailLogin,
  password: validatePasswordLogin,
  last: validatelastSchema,
  phone: validatephoneSchema,
  country: validatecountrySchema,
  city: validatecitySchema,
  street: validatestreetSchema,
  houseNumber: validatehouseNumberSchema,
  zip: validateZipSchema,
  url: validateUrlSchema,
};

export {
  validateEmailLogin,
  validatePasswordLogin,
  validateFirstSchema,
  validatelastSchema,
  validatephoneSchema,
  validatecountrySchema,
  validatecitySchema,
  validatestreetSchema,
  validatehouseNumberSchema,
  validateZipSchema,
  validateSchema,
};
