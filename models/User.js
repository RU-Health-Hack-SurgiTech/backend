import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true }, // Unique username for the user
  password: { type: String, required: true }, // Hashed password for secure storage
  role: {
    type: String,
    enum: ["admin", "surgeon", "scheduler"], // Example roles; customize as needed
    required: true,
  },
});

export default mongoose.model("User", userSchema);
