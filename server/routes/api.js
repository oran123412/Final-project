import express from "express";
import usersRouter from "./api/users.js";
import cardsRouter from "./api/cards.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("api sub route");
});
router.use("/users", usersRouter);
router.use("/cards", cardsRouter);
export default router;
