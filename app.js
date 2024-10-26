import express from "express";

const app = express();

import routesConfig from "./routes/index.js";

app.use(express.json());

routesConfig(app);

const PORT = 3000;

app.listen(PORT, () => {
  console.log("We have a server running");
  console.log(`Now routes will be running on http://localhost:${PORT}`);
});
