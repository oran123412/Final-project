import mongoose from "mongoose";
import {
  DEFAULT_STRING_VALIDATION,
  DEFAULT_REQUIRED_STRING_VALIDATION,
} from "../helper/defaultStringValidation.helper.js";

const Address = new mongoose.Schema({
  state: DEFAULT_STRING_VALIDATION,
  country: DEFAULT_REQUIRED_STRING_VALIDATION,
  city: DEFAULT_REQUIRED_STRING_VALIDATION,
  street: DEFAULT_REQUIRED_STRING_VALIDATION,
  houseNumber: {
    type: Number,
    min: 2,
    max: 256,
    required: true,
  },
  zip: {
    type: String,
    required: true,
    match: /^[0-9a-zA-Z\- ]{2,256}$/,
    default: "10000",
  },
});

export default Address;
