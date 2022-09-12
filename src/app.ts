//dotenv to access environment variables
require("dotenv").config();
import express from "express";
import config from "config";
import logger from "./utils/logger";
import router from "./routes/index";

import connectToDatabase from "./utils/connectToDB";

const port = config.get<number>("port");
const app = express();

app.use(router);

app.listen(port, async () => {
   logger.info(`App is running on port http://localhost:${port}`);
   await connectToDatabase();
});
