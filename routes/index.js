import schedulerRoutes from './scheduler.js';

const constructorMethod = (app) => {
  app.use('/scheduler', schedulerRoutes);
  app.use("*", (req, res) => {
    return res.status(404).json({ error: "Page Not found" });
  });
};

export default constructorMethod;
