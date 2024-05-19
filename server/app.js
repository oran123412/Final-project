import express from "express";
import path from "node:path";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import logger from "./loggers/loggerAdapter.js";
import cors from "cors";
import errorMiddleware from "./middlewares/error.mw.js";
import apiRouter from "./routes/api.router.js";
import dotenv from "dotenv";
import db from "./db.js";
import axios from "axios";
import connectToDb from "./model/dbAdapter.js";
import session from "express-session";

const __dirname = path.resolve(path.dirname(""));
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(logger());
app.use(compression());
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "img-src": ["'self'", "https: data:"],
        "script-src": ["'self'", "'unsafe-inline'"],
        "style-src": ["'self'", "'unsafe-inline'"],
      },
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 14400000 },
  })
);

app.use("/api", apiRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.status(404).send("404: Page Not Found");
});

app.use(errorMiddleware);

app.listen(port, async () => {
  console.log(`Server listening on port  ${port}`);
  await db.connect().catch((err) => {
    console.error("Failed to conne ctto database", err);
    process.exit(1);
  });
  connectToDb();
});

export default app;
