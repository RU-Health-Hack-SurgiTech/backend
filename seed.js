import mongoose from "mongoose";
import Surgery from "./models/Surgery.js";
import Instrument from "./models/Instrument.js";
import Supply from "./models/Supply.js";
import Robot from "./models/Robot.js";
import Surgeon from "./models/Surgeon.js";
import { dbConnection } from "./config/mongoConnection.js";

const seedData = async () => {
  await dbConnection();

  // Clear existing data
  await Surgery.deleteMany({});
  await Instrument.deleteMany({});
  await Supply.deleteMany({});
  await Robot.deleteMany({});
  await Surgeon.deleteMany({});
  // mongoose.deleteModel(/.+/); // Clears all cached models

  const instruments = [
    {
      _id: new mongoose.Types.ObjectId("653acb1e8a432ab12c6a1f10"),
      name: "Scalpel",
      totalQTY: 50,
      reusable: true,
      sterilizationTime: 30,
      tracking: [new Date("2024-10-20"), new Date("2024-10-21")],
    },
    {
      _id: new mongoose.Types.ObjectId("653acb1e8a432ab12c6a1f11"),
      name: "Forceps",
      totalQTY: 30,
      reusable: true,
      sterilizationTime: 45,
      tracking: [],
    },
    {
      _id: new mongoose.Types.ObjectId("653acb1e8a432ab12c6a1f12"),
      name: "Surgical Scissors",
      totalQTY: 20,
      reusable: true,
      sterilizationTime: 40,
      tracking: [],
    },
  ];

  const robots = [
    {
      _id: new mongoose.Types.ObjectId("653acb1e8a432ab12c6a1f15"),
      name: "Da Vinci Robot",
      model: "Da Vinci X",
      maintenanceSchedule: [new Date("2024-10-25"), new Date("2024-11-01")],
      softwareVersion: "v2.3",
      tracking: [],
    },
  ];

  const supplies = [
    {
      _id: new mongoose.Types.ObjectId("653acb1e8a432ab12c6a1f13"),
      name: "Syringe",
      totalQTY: 100,
      reusable: false,
      sterile: false,
      expiryDate: new Date("2025-12-31"),
    },
    {
      _id: new mongoose.Types.ObjectId("653acb1e8a432ab12c6a1f14"),
      name: "Gauze",
      totalQTY: 200,
      reusable: false,
      sterile: false,
      expiryDate: new Date("2025-12-31"),
    },
    {
      _id: new mongoose.Types.ObjectId("653acb1e8a432ab12c6a1f15"),
      name: "Surgical Mask",
      totalQTY: 300,
      reusable: true,
      sterilizationTime: 20,
      sterile: true,
      expiryDate: new Date("2026-01-31"),
    },
    {
      _id: new mongoose.Types.ObjectId("653acb1e8a432ab12c6a1f16"),
      name: "IV Bag",
      totalQTY: 80,
      reusable: false,
      sterile: true,
      expiryDate: new Date("2025-06-30"),
    },
    {
      _id: new mongoose.Types.ObjectId("653acb1e8a432ab12c6a1f17"),
      name: "Endoscope",
      totalQTY: 10,
      reusable: true,
      sterilizationTime: 60,
      sterile: true,
      expiryDate: new Date("2026-12-31"),
    },
    {
      _id: new mongoose.Types.ObjectId("653acb1e8a432ab12c6a1f18"),
      name: "Catheter",
      totalQTY: 150,
      reusable: true,
      sterilizationTime: 30,
      sterile: true,
      expiryDate: new Date("2025-11-30"),
    },
  ];

  // Surgeries to be linked to surgeon's procedures
  const surgeries = [
    {
      name: "Appendectomy",
      code: "44950",
      instruments: [
        { _id: instruments[0]._id, qty: 3 }, // Scalpel
        { _id: instruments[1]._id, qty: 2 }, // Forceps
      ],
      robots: [
        { _id: robots[0]._id, qty: 1 }, // Da Vinci Robot
      ],
      supplies: [
        { _id: supplies[0]._id, qty: 5 }, // Syringe
        { _id: supplies[1]._id, qty: 10 }, // Gauze
        { _id: supplies[4]._id, qty: 1 }, // Endoscope
      ],
      expectedDuration: 90,
    },
    {
      name: "Cholecystectomy",
      code: "47562",
      instruments: [
        { _id: instruments[2]._id, qty: 4 }, // Surgical Scissors
      ],
      robots: [
        { _id: robots[0]._id, qty: 1 }, // Da Vinci Robot
      ],
      supplies: [
        { _id: supplies[1]._id, qty: 8 }, // Gauze
        { _id: supplies[3]._id, qty: 2 }, // IV Bag
        { _id: supplies[5]._id, qty: 1 }, // Catheter
      ],
      expectedDuration: 120,
    },
  ];

  // Insert surgeries into the Surgery collection and fetch their IDs
  const insertedSurgeries = await Surgery.insertMany(surgeries);

  // Define surgeons with references to surgeries
  const surgeons = [
    {
      name: "Dr. John Doe",
      specialty: "General Surgery",
      procedure: {
        name: insertedSurgeries[0].name, // Appendectomy
        code: insertedSurgeries[0].code,
      },
      preferences: {
        instruments: [
          { _id: instruments[0]._id, qty: 7 }, // Scalpel
          { _id: instruments[1]._id, qty: 2 }, // Forceps
        ],
        robots: [
          { _id: robots[0]._id, qty: 1 }, // Da Vinci Robot
        ],
        supplies: [
          { _id: supplies[1]._id, qty: 8 }, // Gauze
          { _id: supplies[3]._id, qty: 2 }, // IV Bag
          { _id: supplies[5]._id, qty: 7 }, // Catheter
        ],
      },
    },
    {
      name: "Dr. Jane Smith",
      specialty: "General Surgery",
      procedure: {
        name: insertedSurgeries[1].name, // Cholecystectomy
        code: insertedSurgeries[1].code,
      },
      preferences: {
        instruments: [
          { _id: instruments[2]._id, qty: 4 }, // Surgical Scissors
        ],
        robots: [
          { _id: robots[0]._id, qty: 1 }, // Da Vinci Robot
        ],
        supplies: [
          { _id: supplies[1]._id, qty: 6 }, // Gauze
          { _id: supplies[3]._id, qty: 2 }, // IV Bag
          { _id: supplies[5]._id, qty: 1 }, // Catheter
        ],
      },
    },
  ];

  // Insert instruments, supplies, robots, and surgeons into collections
  await Instrument.insertMany(instruments);
  await Supply.insertMany(supplies);
  await Robot.insertMany(robots);
  await Surgeon.insertMany(surgeons);

  console.log("Seed data added to the collections");

  mongoose.connection.close();
};

seedData();
