import { Router } from "express";
import { getAllSurgeries } from "../data/surgeries.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const allSurgeries = await getAllSurgeries();
    return res.json(allSurgeries);
  } catch (error) {
    res.status(500).json({ message: "An internal server error occurred" });
  }
});

export default router;
