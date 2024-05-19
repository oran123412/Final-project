import handleError from "../utils/handleError.js";

const Own = (req, res, next) => {
  if (!req.userData) {
    throw new Error("you must be logged in");
  }
  if (req.userData._id === req.params.id) {
    next();
  } else {
    handleError(res, 401, "you not allowed to do this action");
  }
};
export default Own;
