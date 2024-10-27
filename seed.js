import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Surgery from "./models/Surgery.js";
import Instrument from "./models/Instrument.js";
import Supply from "./models/Supply.js";
import Robot from "./models/Robot.js";
import Surgeon from "./models/Surgeon.js";
import User from "./models/User.js";
import Patient from "./models/Patient.js";
import { dbConnection } from "./config/mongoConnection.js";

const seedData = async () => {
  await dbConnection();

  await Surgery.deleteMany({});
  await Instrument.deleteMany({});
  await Supply.deleteMany({});
  await Robot.deleteMany({});
  await Surgeon.deleteMany({});
  await User.deleteMany({});
  await Patient.deleteMany({});

  const instruments = [
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Scalpel",
      totalQTY: 15, // Reduced quantity
      reusable: true,
      sterilizationTime: 30,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Forceps",
      totalQTY: 10, // Reduced quantity
      reusable: true,
      sterilizationTime: 45,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Surgical Scissors",
      totalQTY: 8, // Reduced quantity
      reusable: true,
      sterilizationTime: 40,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Endoscope",
      totalQTY: 5, // Reduced quantity
      reusable: true,
      sterilizationTime: 60,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Bone Saw",
      totalQTY: 7, // Reduced quantity
      reusable: true,
      sterilizationTime: 50,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Drill",
      totalQTY: 6, // Reduced quantity
      reusable: true,
      sterilizationTime: 55,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Retractor",
      totalQTY: 10, // Reduced quantity
      reusable: true,
      sterilizationTime: 40,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Curette",
      totalQTY: 8, // Reduced quantity
      reusable: true,
      sterilizationTime: 30,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Tourniquet",
      totalQTY: 6, // Reduced quantity
      reusable: true,
      sterilizationTime: 15,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Suction Tube",
      totalQTY: 12, // Reduced quantity
      reusable: true,
      sterilizationTime: 20,
    },
  ];

  const supplies = [
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Syringe",
      totalQTY: 60, // Reduced quantity
      reusable: false,
      sterile: true,
      expiryDate: new Date("2025-12-31"),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Gauze",
      totalQTY: 100, // Reduced quantity
      reusable: false,
      sterile: false,
      expiryDate: new Date("2025-12-31"),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Surgical Mask",
      totalQTY: 150, // Reduced quantity
      reusable: false,
      sterile: true,
      expiryDate: new Date("2026-01-31"),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "IV Bag",
      totalQTY: 40, // Reduced quantity
      reusable: false,
      sterile: true,
      expiryDate: new Date("2025-06-30"),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Catheter",
      totalQTY: 50, // Reduced quantity
      reusable: true,
      sterilizationTime: 30,
      sterile: true,
      expiryDate: new Date("2025-11-30"),
    },
  ];

  const robots = [
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Da Vinci Robot",
      model: "Da Vinci X",
      maintenanceSchedule: [new Date("2024-10-25"), new Date("2024-11-01")],
      softwareVersion: "v2.3",
    },
  ];

  const surgeries = [
    {
      name: "Rotator Cuff Repair",
      code: "29827",
      instruments: [
        { _id: instruments[0]._id, qty: 5 },
        { _id: instruments[3]._id, qty: 2 },
      ],
      robots: [{ _id: robots[0]._id, qty: 1 }],
      supplies: [{ _id: supplies[1]._id, qty: 15 }],
      expectedDuration: 120,
    },
    {
      name: "ACL Reconstruction",
      code: "29888",
      instruments: [
        { _id: instruments[4]._id, qty: 1 },
        { _id: instruments[6]._id, qty: 3 },
      ],
      robots: [],
      supplies: [{ _id: supplies[1]._id, qty: 10 }],
      expectedDuration: 180,
    },
    {
      name: "Spinal Decompression",
      code: "63030",
      instruments: [
        { _id: instruments[5]._id, qty: 1 },
        { _id: instruments[7]._id, qty: 4 },
      ],
      robots: [],
      supplies: [{ _id: supplies[3]._id, qty: 1 }],
      expectedDuration: 210,
    },
    {
      name: "Disc Replacement",
      code: "22856",
      instruments: [
        { _id: instruments[4]._id, qty: 2 },
        { _id: instruments[2]._id, qty: 1 },
      ],
      robots: [{ _id: robots[0]._id, qty: 1 }],
      supplies: [{ _id: supplies[4]._id, qty: 5 }],
      expectedDuration: 240,
    },
    {
      name: "Wrist Arthroscopy",
      code: "29846",
      instruments: [
        { _id: instruments[1]._id, qty: 2 },
        { _id: instruments[2]._id, qty: 3 },
      ],
      robots: [],
      supplies: [{ _id: supplies[0]._id, qty: 5 }],
      expectedDuration: 90,
    },
    {
      name: "Carpal Tunnel Release",
      code: "64721",
      instruments: [{ _id: instruments[1]._id, qty: 1 }],
      robots: [],
      supplies: [{ _id: supplies[1]._id, qty: 3 }],
      expectedDuration: 60,
    },
    {
      name: "Trigger Finger Release",
      code: "26055",
      instruments: [{ _id: instruments[0]._id, qty: 1 }],
      robots: [],
      supplies: [{ _id: supplies[1]._id, qty: 2 }],
      expectedDuration: 45,
    },
    {
      name: "Achilles Tendon Repair",
      code: "27650",
      instruments: [
        { _id: instruments[0]._id, qty: 2 },
        { _id: instruments[1]._id, qty: 2 },
      ],
      robots: [],
      supplies: [{ _id: supplies[3]._id, qty: 1 }],
      expectedDuration: 150,
    },
    {
      name: "Bunion Correction",
      code: "28296",
      instruments: [
        { _id: instruments[6]._id, qty: 1 },
        { _id: instruments[7]._id, qty: 1 },
      ],
      robots: [],
      supplies: [{ _id: supplies[1]._id, qty: 5 }],
      expectedDuration: 120,
    },
    {
      name: "Ankle Arthroscopy",
      code: "29891",
      instruments: [{ _id: instruments[2]._id, qty: 3 }],
      robots: [],
      supplies: [{ _id: supplies[1]._id, qty: 10 }],
      expectedDuration: 90,
    },
    {
      name: "Partial Knee Replacement",
      code: "27446",
      instruments: [
        { _id: instruments[4]._id, qty: 1 },
        { _id: instruments[8]._id, qty: 2 },
      ],
      robots: [{ _id: robots[0]._id, qty: 1 }],
      supplies: [{ _id: supplies[1]._id, qty: 8 }],
      expectedDuration: 210,
    },
    {
      name: "Total Knee Replacement",
      code: "27447",
      instruments: [
        { _id: instruments[4]._id, qty: 2 },
        { _id: instruments[8]._id, qty: 2 },
      ],
      robots: [{ _id: robots[0]._id, qty: 1 }],
      supplies: [{ _id: supplies[1]._id, qty: 15 }],
      expectedDuration: 240,
    },
    {
      name: "Meniscus Repair",
      code: "29882",
      instruments: [{ _id: instruments[2]._id, qty: 3 }],
      robots: [],
      supplies: [{ _id: supplies[1]._id, qty: 10 }],
      expectedDuration: 90,
    },
    {
      name: "Lumbar Fusion",
      code: "22612",
      instruments: [
        { _id: instruments[5]._id, qty: 1 },
        { _id: instruments[7]._id, qty: 1 },
      ],
      robots: [{ _id: robots[0]._id, qty: 1 }],
      supplies: [{ _id: supplies[4]._id, qty: 3 }],
      expectedDuration: 300,
    },
    {
      name: "Total Hip Replacement",
      code: "27130",
      instruments: [
        { _id: instruments[4]._id, qty: 1 },
        { _id: instruments[5]._id, qty: 1 },
      ],
      robots: [{ _id: robots[0]._id, qty: 1 }],
      supplies: [{ _id: supplies[1]._id, qty: 15 }],
      expectedDuration: 240,
    },
  ];

  const insertedSurgeries = await Surgery.insertMany(surgeries);
  const saltRounds = 10;

  const users = [
    {
      username: "drjohndoe",
      password: await bcrypt.hash("password123", saltRounds),
      role: "surgeon",
    },
    {
      username: "drjanesmith",
      password: await bcrypt.hash("password456", saltRounds),
      role: "surgeon",
    },
  ];

  const insertedUsers = await User.insertMany(users);

  const patients = [
    {
      name: "Alice Johnson",
      age: 30,
      gender: "Female",
      medicalHistory: ["Diabetes", "Hypertension"],
      surgeries: [],
    },
    {
      name: "Bob Smith",
      age: 45,
      gender: "Male",
      medicalHistory: ["Asthma"],
      surgeries: [],
    },
    {
      name: "Carol Williams",
      age: 38,
      gender: "Female",
      medicalHistory: ["Allergy"],
      surgeries: [],
    },
  ];

  const insertedPatients = await Patient.insertMany(patients);

  const surgeons = [
    {
      name: "Dr. John Doe",
      specialty: "Orthopedic Surgery",
      username: insertedUsers[0].username,
      procedures: insertedSurgeries.slice(0, 8).map((surgery) => ({
        name: surgery.name,
        code: surgery.code,
        preferences: {
          instruments: surgery.instruments,
          robots: surgery.robots,
          supplies: surgery.supplies,
        },
      })),
      appointments: [
        {
          surgeryCode: insertedSurgeries[0].code,
          patientID: insertedPatients[0]._id,
          surgeryBefore: new Date("2024-11-06"),
        },
      ],
    },
    {
      name: "Dr. Jane Smith",
      specialty: "Orthopedic Surgery",
      username: insertedUsers[1].username,
      procedures: insertedSurgeries.slice(8).map((surgery) => ({
        name: surgery.name,
        code: surgery.code,
        preferences: {
          instruments: surgery.instruments,
          robots: surgery.robots,
          supplies: surgery.supplies,
        },
      })),
      appointments: [
        {
          surgeryCode: insertedSurgeries[1].code,
          patientID: insertedPatients[1]._id,
          surgeryBefore: new Date("2024-11-02"),
        },
      ],
    },
  ];

  await Instrument.insertMany(instruments);
  await Supply.insertMany(supplies);
  await Robot.insertMany(robots);
  await Surgeon.insertMany(surgeons);

  const additionalSurgeons = [
    {
      name: "Dr. Emily Taylor",
      specialty: "Orthopedic Surgery",
      username: "dremilytaylor",
      procedures: insertedSurgeries.slice(5, 10).map((surgery) => ({
        name: surgery.name,
        code: surgery.code,
        preferences: {
          instruments: surgery.instruments,
          robots: surgery.robots,
          supplies: surgery.supplies,
        },
      })),
      appointments: [
        {
          surgeryCode: insertedSurgeries[6].code,
          patientID: insertedPatients[0]._id,
          surgeryBefore: new Date("2024-11-08"),
        },
      ],
    },
    {
      name: "Dr. Andrew Brown",
      specialty: "General Surgery",
      username: "drandrewbrown",
      procedures: insertedSurgeries.slice(0, 5).map((surgery) => ({
        name: surgery.name,
        code: surgery.code,
        preferences: {
          instruments: surgery.instruments,
          robots: surgery.robots,
          supplies: surgery.supplies,
        },
      })),
      appointments: [
        {
          surgeryCode: insertedSurgeries[2].code,
          patientID: insertedPatients[2]._id,
          surgeryBefore: new Date("2024-11-10"),
        },
      ],
    },
    {
      name: "Dr. Rachel Green",
      specialty: "Spinal Surgery",
      username: "drrachelgreen",
      procedures: insertedSurgeries.slice(10, 15).map((surgery) => ({
        name: surgery.name,
        code: surgery.code,
        preferences: {
          instruments: surgery.instruments,
          robots: surgery.robots,
          supplies: surgery.supplies,
        },
      })),
      appointments: [
        {
          surgeryCode: insertedSurgeries[12].code,
          patientID: insertedPatients[1]._id,
          surgeryBefore: new Date("2024-11-12"),
        },
      ],
    },
  ];

  await Surgeon.insertMany(additionalSurgeons);

  const additionalPatients = [
    {
      name: "Sophia Miller",
      age: 34,
      gender: "Female",
      medicalHistory: ["Asthma"],
    },
    {
      name: "Jackson Carter",
      age: 50,
      gender: "Male",
      medicalHistory: ["Diabetes"],
    },
    {
      name: "Ava Thompson",
      age: 40,
      gender: "Female",
      medicalHistory: ["Hypertension"],
    },
    {
      name: "Lucas Johnson",
      age: 60,
      gender: "Male",
      medicalHistory: ["Arthritis"],
    },
    {
      name: "Emma Williams",
      age: 29,
      gender: "Female",
      medicalHistory: ["Allergy"],
    },
    {
      name: "Liam Martinez",
      age: 55,
      gender: "Male",
      medicalHistory: ["Asthma"],
    },
    {
      name: "Isabella Lee",
      age: 45,
      gender: "Female",
      medicalHistory: ["Diabetes"],
    },
    {
      name: "Noah White",
      age: 65,
      gender: "Male",
      medicalHistory: ["Heart Disease"],
    },
    {
      name: "Mia Harris",
      age: 39,
      gender: "Female",
      medicalHistory: ["Hypertension"],
    },
    {
      name: "Elijah Clark",
      age: 47,
      gender: "Male",
      medicalHistory: ["Allergy"],
    },
    {
      name: "Amelia Lewis",
      age: 52,
      gender: "Female",
      medicalHistory: ["Asthma"],
    },
    {
      name: "James Robinson",
      age: 67,
      gender: "Male",
      medicalHistory: ["Diabetes"],
    },
    {
      name: "Charlotte Walker",
      age: 35,
      gender: "Female",
      medicalHistory: ["Hypertension"],
    },
    {
      name: "Benjamin Hall",
      age: 48,
      gender: "Male",
      medicalHistory: ["Arthritis"],
    },
    {
      name: "Olivia Young",
      age: 53,
      gender: "Female",
      medicalHistory: ["Heart Disease"],
    },
  ];

  await Patient.insertMany(additionalPatients);

  const additionalAppointments = [
    {
      surgeryCode: insertedSurgeries[4].code,
      patientID: additionalPatients[0]._id,
      surgeryBefore: new Date("2024-12-01"),
    },
    {
      surgeryCode: insertedSurgeries[8].code,
      patientID: additionalPatients[1]._id,
      surgeryBefore: new Date("2024-12-03"),
    },
    {
      surgeryCode: insertedSurgeries[9].code,
      patientID: additionalPatients[2]._id,
      surgeryBefore: new Date("2024-12-04"),
    },
    {
      surgeryCode: insertedSurgeries[6].code,
      patientID: additionalPatients[3]._id,
      surgeryBefore: new Date("2024-12-05"),
    },
    {
      surgeryCode: insertedSurgeries[10].code,
      patientID: additionalPatients[4]._id,
      surgeryBefore: new Date("2024-12-06"),
    },
    {
      surgeryCode: insertedSurgeries[2].code,
      patientID: additionalPatients[5]._id,
      surgeryBefore: new Date("2024-12-08"),
    },
    {
      surgeryCode: insertedSurgeries[7].code,
      patientID: additionalPatients[6]._id,
      surgeryBefore: new Date("2024-12-10"),
    },
    {
      surgeryCode: insertedSurgeries[11].code,
      patientID: additionalPatients[7]._id,
      surgeryBefore: new Date("2024-12-11"),
    },
    {
      surgeryCode: insertedSurgeries[12].code,
      patientID: additionalPatients[8]._id,
      surgeryBefore: new Date("2024-12-12"),
    },
    {
      surgeryCode: insertedSurgeries[13].code,
      patientID: additionalPatients[9]._id,
      surgeryBefore: new Date("2024-12-13"),
    },
    {
      surgeryCode: insertedSurgeries[0].code,
      patientID: additionalPatients[10]._id,
      surgeryBefore: new Date("2024-12-14"),
    },
    {
      surgeryCode: insertedSurgeries[5].code,
      patientID: additionalPatients[11]._id,
      surgeryBefore: new Date("2024-12-15"),
    },
    {
      surgeryCode: insertedSurgeries[3].code,
      patientID: additionalPatients[12]._id,
      surgeryBefore: new Date("2024-12-17"),
    },
    {
      surgeryCode: insertedSurgeries[14].code,
      patientID: additionalPatients[13]._id,
      surgeryBefore: new Date("2024-12-18"),
    },
    {
      surgeryCode: insertedSurgeries[1].code,
      patientID: additionalPatients[14]._id,
      surgeryBefore: new Date("2024-12-20"),
    },
  ];

  await Surgeon.updateMany(
    {
      name: {
        $in: ["Dr. Emily Taylor", "Dr. Andrew Brown", "Dr. Rachel Green"],
      },
    },
    { $push: { appointments: { $each: additionalAppointments } } }
  );

  console.log("Seed data added to the collections");

  mongoose.connection.close();
};

seedData();
