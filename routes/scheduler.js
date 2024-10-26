// routes/schedule.js
import { Router } from "express";
import {suggestFeasibleSchedule} from "../data/scheduler.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { schedule } = req.body;

    if (!schedule || !Array.isArray(schedule)) {
      return res.status(400).json({ message: "Invalid schedule format" });
    }

    // Call the function to suggest a feasible schedule
    const result = await suggestFeasibleSchedule(schedule);

    // Send the response based on the result from the function
    if (result.valid) {
      return res.status(200).json({
        message: result.message,
        suggestedSchedule: result.suggestedSchedule,
      });
    } else {
      return res.status(400).json({
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error processing schedule:", error);
    res.status(500).json({ message: "An internal server error occurred" });
  }
});

export default router;
