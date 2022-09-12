import mongoose from "mongoose";
import config from "config";
import logger from "./logger";

const connectToDatabase = async () => {
   try {
      const dbUri = config.get<string>("dbUri");
      const connect = await mongoose.connect(dbUri);
      logger.info(`Connected to Database: ${connect.connection.host}`);
   } catch (error) {
      console.error("Could not connect to the database");
      logger.error(error);
      process.exit(1);
   }
};

export default connectToDatabase;
