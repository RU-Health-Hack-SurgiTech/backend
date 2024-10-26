// db.js (or mongoConnection.js)

import mongoose from "mongoose";
import { mongoConfig } from "./settings.js";

let isConnected = false;

const dbConnection = async () => {
  if (!isConnected) {
    try {
      await mongoose.connect(mongoConfig.serverUrl, {
        dbName: mongoConfig.database,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      isConnected = true;
      console.log("Connected to MongoDB via Mongoose");
    } catch (error) {
      console.error("Failed to connect to MongoDB", error);
      process.exit(1); // Exit process with failure
    }
  }
};

const closeConnection = async () => {
  if (isConnected) {
    await mongoose.connection.close();
    isConnected = false;
    console.log("Disconnected from MongoDB");
  }
};

export { dbConnection, closeConnection };
  