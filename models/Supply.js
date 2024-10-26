// models/Supply.js

import mongoose from "mongoose";

const supplySchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalQTY: { type: Number, required: true },
  reusable: { type: Boolean, required: true },
  sterilizationTime: {
    type: Number,
    required: function () {
      return this.reusable;
    },
  }, // in minutes, required if reusable is true
  sterile: { type: Boolean, required: true },
  expiryDate: { type: Date, required: true },
});

export default mongoose.model("Supply", supplySchema);
