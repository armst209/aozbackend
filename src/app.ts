//dotenv to access environment variables
require("dotenv").config();
import express from "express";
import cors from "cors";
import config from "config";
import logger from "./utils/logger";
import router from "./routes/index";
import connectToDatabase from "./utils/connectToDB";
import authorizeUser from "./middleware/authorizeUser";

const port = config.get<number>("port");

const app = express();

//Middleware - THE ORDER OF MIDDLEWARE MATTERS
app.use(cors());

app.use(express.json()); //replaces body parser - must be above router

app.use(authorizeUser); //for user routes that require jwt but don't require admin status

app.use(router);

app.listen(port, async () => {
  logger.info(
    `CORS-enabled web server running on port http://localhost:${port}`
  );
  await connectToDatabase();
});
