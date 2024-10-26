// models/Supply.js

import mongoose from 'mongoose';

const supplySchema = new mongoose.Schema({
    name: { type: String, required: true },
    totalQTY: { type: Number, required: true },
    disposable: { type: Boolean, required: true },
    sterile: { type: Boolean, required: true },
    expiryDate: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model('Supply', supplySchema);
