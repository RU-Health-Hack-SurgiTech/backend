import { Router } from "express";
const router = Router();

const userData = [
  { usernmae: "drjohndoe", password: "password123", role: "surgeon" },
  { usernmae: "drjanesmith", password: "password456", role: "surgeon" },
  { username: "admin", password: "Admin@123", role: "scheduler" },
];

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = userData.find(
      (user) => user.username === username.toLowerCase()
    );
    if (!user) {
      return res
        .status(401)
        .json({ login: false, error: "Invalid username or password" });
    }
    if (user.password !== password) {
      return res
        .status(401)
        .json({ login: false, error: "Invalid username or password" });
    }

    return res.json({ login: true, role: user.role });
  } catch (error) {
    return res.json({ error: "Internal Server Error" });
  }
});

export default router;
