import handleError from "../utils/handleError.js";

const adminOrBizWithIdCheckMiddleware = (req, res, next) => {
  if (!req.userData) {
    return handleError(res, 401, "You must be logged in");
  }
  const { cardId } = req.params;

  if (
    (req.userData.isAdmin || req.userData.isBusiness) &&
    req.userData.id === cardId
  ) {
    next();
  } else {
    handleError(res, 403, "Access denied");
  }
};

export default adminOrBizWithIdCheckMiddleware;
