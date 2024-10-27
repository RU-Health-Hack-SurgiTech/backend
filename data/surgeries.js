import Surgery from "../models/Surgery.js";
import Robot from "../models/Robot.js";

export const getAllSurgeries = async () => {
    const allSurgeries = await Surgery.find({})
      .populate({
        path: "instruments._id",
        model: "Instrument",
      })
      .populate({
        path: "robots._id",
        model: "Robot",
      })
      .populate({
        path: "supplies._id",
        model: "Supply",
      });
  
    return allSurgeries;
  };
  
