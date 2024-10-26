import mongoose from 'mongoose';
import Surgery from './models/Surgery.js';
import Instrument from './models/Instrument.js';
import Supply from './models/Supply.js';
import Robot from './models/Robot.js';
import { dbConnection } from './config/mongoConnection.js';

const seedData = async () => {
  await dbConnection();

  // Clear existing data
  await Surgery.deleteMany({});
  await Instrument.deleteMany({});
  await Supply.deleteMany({});
  await Robot.deleteMany({});

  const instruments = [
    {
      _id: new mongoose.Types.ObjectId("653acb1e8a432ab12c6a1f10"),
      name: "Scalpel",
      totalQTY: 50,
      reusable: true,
      sterilizationTime: 30,
      tracking: [new Date("2024-10-20"), new Date("2024-10-21")]
    },
    {
      _id: new mongoose.Types.ObjectId("653acb1e8a432ab12c6a1f11"),
      name: "Forceps",
      totalQTY: 30,
      reusable: true,
      sterilizationTime: 45,
      tracking: []
    },
    {
      _id: new mongoose.Types.ObjectId("653acb1e8a432ab12c6a1f12"),
      name: "Surgical Scissors",
      totalQTY: 20,
      reusable: true,
      sterilizationTime: 40,
      tracking: []
    }
  ];

  const supplies = [
    {
      _id: new mongoose.Types.ObjectId("653acb1e8a432ab12c6a1f13"),
      name: "Syringe",
      totalQTY: 100,
      disposable: true,
      sterile: true,
      expiryDate: new Date("2025-12-31")
    },
    {
      _id: new mongoose.Types.ObjectId("653acb1e8a432ab12c6a1f14"),
      name: "Gauze",
      totalQTY: 200,
      disposable: true,
      sterile: true,
      expiryDate: new Date("2025-12-31")
    }
  ];

  const robots = [
    {
      _id: new mongoose.Types.ObjectId("653acb1e8a432ab12c6a1f15"),
      name: "Da Vinci Robot",
      model: "Da Vinci X",
      maintenanceSchedule: [new Date("2024-10-25"), new Date("2024-11-01")],
      softwareVersion: "v2.3",
      tracking: []
    }
  ];

  const surgeries = [
    {
      name: "Appendectomy",
      code: "44950",
      instruments: [
        { _id: instruments[0]._id, qty: 3 }, // Scalpel
        { _id: instruments[1]._id, qty: 2 }  // Forceps
      ],
      robots: [
        { _id: robots[0]._id, qty: 1 }  // Da Vinci Robot
      ],
      supplies: [
        { _id: supplies[0]._id, qty: 5 }, // Syringe
        { _id: supplies[1]._id, qty: 10 } // Gauze
      ],
      expectedDuration: 90
    },
    {
      name: "Cholecystectomy",
      code: "47562",
      instruments: [
        { _id: instruments[2]._id, qty: 4 } // Surgical Scissors
      ],
      robots: [
        { _id: robots[0]._id, qty: 1 }  // Da Vinci Robot
      ],
      supplies: [
        { _id: supplies[1]._id, qty: 8 } // Gauze
      ],
      expectedDuration: 120
    },
    {
      name: "Cataract Surgery",
      code: "66984",
      instruments: [
        { _id: instruments[0]._id, qty: 1 }, // Scalpel
        { _id: instruments[1]._id, qty: 1 }  // Forceps
      ],
      supplies: [
        { _id: supplies[0]._id, qty: 2 }, // Syringe
      ],
      expectedDuration: 60
    }
  ];

  await Instrument.insertMany(instruments);
  await Supply.insertMany(supplies);
  await Robot.insertMany(robots);
  await Surgery.insertMany(surgeries);

  console.log("Seed data added to the collections");

  mongoose.connection.close();
};

seedData();
