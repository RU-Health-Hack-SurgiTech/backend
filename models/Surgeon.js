import mongoose from "mongoose";

const PreferenceSchema = new mongoose.Schema({
  instruments: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Instrument" },
      qty: { type: Number, required: true },
    },
  ],
  robots: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Robot" },
      qty: { type: Number, required: true },
    },
  ],
  supplies: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Supply" },
      qty: { type: Number, required: true },
    },
  ],
});

const ProcedureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  preferences: { type: PreferenceSchema, required: true },
});

const AppointmentSchema = new mongoose.Schema({
  surgeryCode: { type: String, required: true },
  patientID: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  surgeryBefore: { type: Date, required: true },
  isScheduled: { type: Boolean },
});

const SurgeonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  username: { type: String, required: true },
  procedures: [ProcedureSchema],
  appointments: [AppointmentSchema],
});

export default mongoose.model("Surgeon", SurgeonSchema);
