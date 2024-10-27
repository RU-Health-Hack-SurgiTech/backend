import schedulerRoutes from "./scheduler.js";
import surgeonRoutes from "./surjeon.js";
import loginRoutes from "./login.js";

const constructorMethod = (app) => {
  app.use("/scheduler", schedulerRoutes);
  app.use("/surgeons", surgeonRoutes);
  app.use("/login", loginRoutes);
  app.use("*", (req, res) => {
    return res.status(404).json({ error: "Page Not found" });
  });
};

export default constructorMethod;
