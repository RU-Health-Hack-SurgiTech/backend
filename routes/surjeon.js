import { Router } from "express";
import { getSurgeoon, addAppointment } from "../data/surejeon.js";

const router = Router();

router.get("/:username", async (req, res) => {
  try {
    const getSurgeonsData = await getSurgeoon(req.params.username);
    return res.status(200).json(getSurgeonsData);
  } catch (error) {
    return res.json({
      error: error.message ? error.message : "Internal Server Error",
    });
  }
});

router.post("/addAppointment", async (req, res) => {
  try {
    const addAppointemtToSurgeon = await addAppointment(
      req.session?.username ? req.session.username : "drjohndoe",
      req.body
    );
    return res.json(addAppointemtToSurgeon);
  } catch (error) {
    return res.json({
      error: error.message ? error.message : "Internal Server Error",
    });
  }
});

export default router;
