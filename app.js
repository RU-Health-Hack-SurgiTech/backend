import express from "express";
import cors from 'cors';

const app = express();

import routesConfig from "./routes/index.js";
import { dbConnection } from "./config/mongoConnection.js";

dbConnection();


app.use(express.json());

app.use(cors());

routesConfig(app);

const PORT = 3000;

app.listen(PORT, () => {
  console.log("We have a server running");
  console.log(`Now routes will be running on http://localhost:${PORT}`);
});
