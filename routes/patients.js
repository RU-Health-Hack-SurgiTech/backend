import { Router } from "express";
import { getAllPatients } from "../data/patients.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const allPatients = await getAllPatients();
    return res.json(allPatients);
  } catch (error) {
    res.status(500).json({ message: "An internal server error occurred" });
  }
});

export default router;
