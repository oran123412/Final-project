import mongoose from "mongoose";
import {
  DEFAULT_STRING_VALIDATION_CARDS,
  DEFAULT_REQUIRED_STRING_VALIDATION_CARDS,
} from "../helper/defaultStringValidation.helper.js";

const Address = new mongoose.Schema({
  state: DEFAULT_STRING_VALIDATION_CARDS,
  country: DEFAULT_REQUIRED_STRING_VALIDATION_CARDS,
  city: DEFAULT_REQUIRED_STRING_VALIDATION_CARDS,
  street: DEFAULT_REQUIRED_STRING_VALIDATION_CARDS,
  houseNumber: {
    type: Number,
    required: true,
  },
  zip: {
    type: String,
    required: true,
    default: 0,
  },
});

export default Address;
