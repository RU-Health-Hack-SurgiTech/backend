// models/Instrument.js

import mongoose from "mongoose";

const instrumentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalQTY: { type: Number, required: true },
  reusable: { type: Boolean, required: true },
  sterilizationTime: { type: Number, required: false, default: 0 },
  tracking: { type: [Date], default: [] },
});

export default mongoose.model("Instrument", instrumentSchema);
