import schedulerRoutes from "./scheduler.js";
import surgeonRoutes from "./surjeon.js";

const constructorMethod = (app) => {
  app.use("/scheduler", schedulerRoutes);
  app.use("/surgeons", surgeonRoutes);
  app.use("*", (req, res) => {
    return res.status(404).json({ error: "Page Not found" });
  });
};

export default constructorMethod;
