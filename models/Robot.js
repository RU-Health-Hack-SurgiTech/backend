import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const robotSchema = new Schema({
    name: { type: String, required: true },
    model: { type: String, required: true },
    maintenanceSchedule: { type: [Date], required: true },
    softwareVersion: { type: String, required: true },
    tracking: { type: [Date], default: [] } 
}, { timestamps: true });

export default model('Robot', robotSchema);
