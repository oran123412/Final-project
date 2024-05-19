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
const CreditCardSchema = Joi.object({
  CreditCard: Joi.string()
    .pattern(/^\d{13,19}$/)
    .message("worng credit card number , requierd between 13 and 19  digits "),
});

const cardValiditySchema = Joi.object({
  cardValidity: Joi.string()
    .pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)
    .message("cardValidity must be in MM/YY format and valide")
    .custom((value, helpers) => {
      const [month, year] = value.split("/").map(Number);
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;

      if (
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        return helpers.message("Expiration date must be in the future.");
      }

      return value;
    }, "Expiration Date Validation")
    .message({
      "string.pattern.base": "Expiration date must be in MM/YY format.",
    }),
});
const cvvSchema = Joi.object({
  cvv: Joi.string()
    .pattern(/^[0-9]{3,4}$/)
    .message("CVV must be 3 or 4 digits."),
});
const idSchema = Joi.object({
  id: Joi.string().hex().min(8).max(10).messages({
    "string.base": "ID must be a string.",
    "string.hex": "ID must be hexadecimal.",
    "string.min": "ID must contain at least 8 figures.",
    "string.max": "ID must contain no more than 10 figures.",
  }),
});

const validateFirstSchema = (first) => firstSchema.validate(first);
const validatelastSchema = (last) => lastSchema.validate(last);
const validatephoneSchema = (phone) => phoneSchema.validate(phone);
const validatecountrySchema = (country) => countrySchema.validate(country);
const validatecitySchema = (city) => citySchema.validate(city);
const validatestreetSchema = (street) => streetSchema.validate(street);
const validatehouseNumberSchema = (houseNumber) =>
  houseNumberSchema.validate(houseNumber);
const validateZipSchema = (zip) => zipSchema.validate(zip);
const validateCreditCardSchema = (CreditCard) =>
  CreditCardSchema.validate(CreditCard);
const validatecardValiditySchema = (cardValidity) =>
  cardValiditySchema.validate(cardValidity);
const validateIdSchema = (id) => idSchema.validate(id);
const validateCvvSchema = (cvv) => cvvSchema.validate(cvv);

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
  id: validateIdSchema,
  CreditCard: validateCreditCardSchema,
  cardValidity: validatecardValiditySchema,
  cvv: validateCvvSchema,
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
  validateIdSchema,
  validateCreditCardSchema,
  validatecardValiditySchema,
  validateCvvSchema,
  validateSchema,
};
