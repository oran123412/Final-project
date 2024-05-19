import moongoose from "mongoose";
import { DEFAULT_STRING_VALIDATION } from "../helper/defaultStringValidation.helper.js";
const Image = new moongoose.Sechma({
  url: URL,
  alt: DEFAULT_STRING_VALIDATION,
});
export default Image;
