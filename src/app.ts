//dotenv to access environment variables
require("dotenv").config();
import express from "express";
import cors from "cors";
import config from "config";
import logger from "./utils/logger";
import router from "./routes/index";
import connectToDatabase from "./utils/connectToDB";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler";
import authorizeUser from "./middleware/authorizeUser";

const port = config.get<number>("port");

const app = express();

//Middleware - THE ORDER OF MIDDLEWARE MATTERS

app.use(cookieParser()); //for setting cookies
app.use(express.json()); //replaces body parser - must be above router

app.use(authorizeUser); //http only cookie authorized routers

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(router);

app.use(errorHandler); //custom error handler

app.listen(port, async () => {
  logger.info(
    `CORS-enabled web server running on port http://localhost:${port}`
  );
  await connectToDatabase();
});
