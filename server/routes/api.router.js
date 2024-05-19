import express from "express";
import usersRouter from "./api/users.router.js";
import cardsRouter from "./api/cards.router.js";
import booksRouter from "./api/booksRouter.js";
import handleError from "../utils/handleError.js";
const router = express.Router();
// ./api/

router.use("/users", usersRouter);

router.use("/cards", cardsRouter);

router.use("/books", booksRouter);

export default router;
