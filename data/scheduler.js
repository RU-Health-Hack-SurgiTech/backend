import moment from "moment";
import Surgery from "../models/Surgery.js";
import Instrument from "../models/Instrument.js";
import Supply from "../models/Supply.js";
import Surgeon from "../models/Surgeon.js";
import Patient from "../models/Patient.js";

export const suggestFeasibleSchedule = async (schedule) => {
  try {
    const allSurgeries = await Surgery.find({})
      .populate("instruments._id")
      .populate("supplies._id");
    const allInstruments = await Instrument.find({});
    const allSupplies = await Supply.find({});

    let instrumentAvailability = {};
    let supplyAvailability = {};

    // Initialize availability for instruments and supplies
    allInstruments.forEach((inst) => {
      instrumentAvailability[inst._id.toString()] = {
        totalQTY: inst.totalQTY,
        reusable: inst.reusable,
        sterilizationTime: inst.sterilizationTime,
        nextAvailableTime: {}, // Track next available time per day
      };
    });

    allSupplies.forEach((supply) => {
      supplyAvailability[supply._id.toString()] = {
        totalQTY: supply.totalQTY,
        reusable: supply.reusable,
        sterilizationTime: supply.sterilizationTime,
        nextAvailableTime: {}, // Track next available time per day
      };
    });

    let suggestedSchedule = [];

    // Sort schedule by day to process each date individually
    const scheduleByDate = schedule.reduce((acc, { time, appointmentId }) => {
      const day = moment(time).format("YYYY-MM-DD");
      if (!acc[day]) acc[day] = [];
      acc[day].push({ time, appointmentId });
      return acc;
    }, {});
    for (const [day, surgeries] of Object.entries(scheduleByDate)) {
      for (const { time, surgeonName, appointmentId } of surgeries) {
        const scheduledTime = moment(time);
        let resolvedTime = scheduledTime;
        let reasons = [];

        // Fetch the surgeon based on the appointmentId
        const surgeon = await Surgeon.findOne({
          "appointments._id": appointmentId,
        })
          .populate("procedures.preferences.instruments._id")
          .populate("procedures.preferences.supplies._id")
          .populate("appointments._id")
          .populate("appointments.patientID");

        // Check if the surgeon is found
        if (!surgeon) {
          return {
            valid: false,
            message: `No surgeon found with appointment ID: ${appointmentId}`,
          };
        }

        // Locate the specific appointment using appointmentId
        const appointment = surgeon.appointments.find(
          (app) => app._id.toString() === appointmentId
        );

        if (!appointment) {
          return {
            valid: false,
            message: `No appointment found with ID: ${appointmentId}`,
          };
        }

        // Get the surgery code from the appointment
        const surgeryCode = appointment.surgeryCode; // Adjust if the field name is different

        const surgeryDetails = allSurgeries.find((s) => s.code === surgeryCode);
        if (!surgeryDetails) {
          return {
            valid: false,
            message: `Invalid surgery code: ${surgeryCode}`,
          };
        }

        let dayConflict = false;

        // Locate specific surgeon's procedure if it matches the surgery code
        const surgeonProcedure = surgeon.procedures.find(
          (proc) => proc.code === surgeryCode
        );

        // Instrument scheduling logic
        for (const instrumentReq of surgeryDetails.instruments) {
          const instrumentId = instrumentReq._id._id.toString();
          const instrument = instrumentAvailability[instrumentId];

          const preferredQty =
            surgeonProcedure?.preferences?.instruments.find(
              (pref) => pref._id._id.toString() === instrumentId
            )?.qty || instrumentReq.qty;

          if (!instrument) {
            throw new Error(
              `Instrument with ID ${instrumentId} is missing from inventory.`
            );
          }

          const dayAvailableTime =
            instrument.nextAvailableTime[day] || moment(day).startOf("day");

          if (instrument.reusable) {
            const readyTime = dayAvailableTime
              .clone()
              .add(instrument.sterilizationTime, "minutes");
            if (readyTime.isAfter(resolvedTime)) {
              reasons.push(
                `Adjusted due to sterilization time of instrument ${instrumentReq._id.name}`
              );
              resolvedTime = moment.max(resolvedTime, readyTime);
            }

            instrument.nextAvailableTime[day] = resolvedTime
              .clone()
              .add(surgeryDetails.expectedDuration, "minutes");
          } else {
            if (instrument.totalQTY < preferredQty) {
              reasons.push(
                `Insufficient quantity of non-reusable instrument ${instrumentReq._id.name}`
              );
              dayConflict = true;
              break;
            }
            instrument.totalQTY -= preferredQty;
          }
        }

        if (dayConflict) {
          suggestedSchedule.push({
            time: scheduledTime.format("MM/DD/YYYY HH:mm"),
            surgery: surgeryCode,
            surgeon: surgeonName,
            reason: "Conflict on this day. Try another day.",
          });
          continue;
        }

        // Supply scheduling logic
        for (const supplyReq of surgeryDetails.supplies) {
          const supplyId = supplyReq._id._id.toString();
          const supply = supplyAvailability[supplyId];

          const preferredQty =
            surgeonProcedure?.preferences?.supplies.find(
              (pref) => pref._id._id.toString() === supplyId
            )?.qty || supplyReq.qty;

          if (!supply) {
            throw new Error(
              `Supply with ID ${supplyId} is missing from inventory.`
            );
          }

          const dayAvailableTime =
            supply.nextAvailableTime[day] || moment(day).startOf("day");

          if (supply.reusable) {
            const readyTime = dayAvailableTime
              .clone()
              .add(supply.sterilizationTime, "minutes");
            if (readyTime.isAfter(resolvedTime)) {
              reasons.push(
                `Adjusted due to sterilization time of supply ${supplyReq._id.name}`
              );
              resolvedTime = moment.max(resolvedTime, readyTime);
            }

            supply.nextAvailableTime[day] = resolvedTime
              .clone()
              .add(surgeryDetails.expectedDuration, "minutes");
          } else {
            if (supply.totalQTY < preferredQty) {
              reasons.push(
                `Insufficient quantity of non-reusable supply ${supplyReq._id.name}`
              );
              dayConflict = true;
              break;
            }
            supply.totalQTY -= preferredQty;
          }
        }

        if (dayConflict) {
          suggestedSchedule.push({
            originalTime: moment(time).format("MM/DD/YYYY HH:mm"),
            time: scheduledTime.format("MM/DD/YYYY HH:mm"),
            surgery: surgeryCode,
            surgeryName: surgeryDetails.name,
            reason: "Conflict on this day. Try another day.",
            adjusted: true,
            patient: appointment.patientID.name,
            surgeon: surgeon.name,
            surgeryBefore: appointment.surgeryBefore,
            duration: surgeryDetails.expectedDuration,
          });
          continue;
        }

        // Append the scheduled surgery with adjustments (if any)
        suggestedSchedule.push({
          _id: appointmentId,
          originalTime: moment(time).format("MM/DD/YYYY HH:mm"),
          time: resolvedTime.format("MM/DD/YYYY HH:mm"),
          surgery: surgeryCode,
          surgeryName: surgeryDetails.name,
          reason: reasons.length ? reasons : "Scheduled as requested",
          adjusted: reasons.length ? true : false,
          patient: appointment.patientID.name,
          surgeon: surgeon.name,
          surgeryBefore: appointment.surgeryBefore,
          duration: surgeryDetails.expectedDuration,
        });
      }
    }

    return {
      valid: true,
      message: "Schedule adjusted successfully.",
      suggestedSchedule,
    };
  } catch (error) {
    console.error("Error suggesting schedule:", error);
    return {
      valid: false,
      message:
        error.message || "An error occurred while suggesting the schedule.",
    };
  }
};
