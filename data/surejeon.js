import Surgeon from "../models/Surgeon.js";
import mongoose from "mongoose";

export const getSurgeoon = async (username) => {
  const surgeon = await Surgeon.findOne({ username: username })
    .populate({
      path: "procedures.preferences.instruments._id",
      model: "Instrument",
    })
    .populate({
      path: "procedures.preferences.supplies._id",
      model: "Supply",
    })
    .populate({
      path: "procedures.preferences.robots._id",
      model: "Robot",
    })
    .populate({
      path: "appointments.patientID",
      model: "Patient",
    });
  if (!surgeon) {
    throw new Error("No surgeon with specified username");
  }

  return surgeon;
};

export const addAppointment = async (username, appObj) => {
  const surgeon = await Surgeon.findOne({ username });
  if (!surgeon) {
    throw new Error("No surgeon found with the specified username");
  }
  const newAppObj = { _id: new mongoose.Types.ObjectId(), ...appObj };
  surgeon.appointments.push(newAppObj);
  await surgeon.save();

  return surgeon;
};
