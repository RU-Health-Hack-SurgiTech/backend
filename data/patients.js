import Patient from "../models/Patient.js";

export const getAllPatients = async () => {
  const allPatients = await Patient.find({});
  return allPatients;
};
