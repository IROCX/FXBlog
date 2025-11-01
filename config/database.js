import mongoose from "mongoose";
import logger from "./logger.js";
import dotenv from "dotenv";
dotenv.config();

const dbURL = `mongodb+srv://${process.env.uname}:${process.env.password}@cluster0-ji2ke.azure.mongodb.net?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    logger.info("Connected to production database");
  } catch (err) {
    logger.error("Error connecting to production database:", err);
    process.exit(1);
  }
};

export default connectDB;
