import mongoose from "mongoose";

const { Schema, model } = mongoose;

const surgeonSchema = new Schema(
  {
    name: { type: String, required: true }, // Surgeon's full name
    specialty: { type: String, required: true }, // Surgical specialty
    procedure: {
      name: { type: String, required: true }, // Specific procedure name
      code: { type: String }, // CPT or ICD code, if applicable
    },
    preferences: {
      instruments: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Instrument",
            required: true,
          },
          qty: { type: Number, required: true },
        },
      ],
      robots: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Robot",
            required: true,
          },
          qty: { type: Number, required: true },
        },
      ],
      supplies: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supply",
            required: true,
          },
          qty: { type: Number, required: true },
        },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Surgeon", surgeonSchema);
