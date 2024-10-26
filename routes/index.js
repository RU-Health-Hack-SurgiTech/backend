const constructorMethod = (app) => {
  app.use("*", (req, res) => {
    return res.status(404).json({ error: "Page Not found" });
  });
};

export default constructorMethod;
