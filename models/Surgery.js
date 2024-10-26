import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const surgerySchema = new Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    instruments: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Instrument', required: true },
            qty: { type: Number, required: true }
        }
    ],
    robots: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Robot', required: true },
            qty: { type: Number, required: true }
        }
    ],
    supplies: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Supply', required: true },
            qty: { type: Number, required: true }
        }
    ],
    expectedDuration: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Surgery', surgerySchema);
