import moment from "moment";
import Surgery from "../models/Surgery.js";
import Instrument from "../models/Instrument.js";
import Supply from "../models/Supply.js";

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
    const scheduleByDate = schedule.reduce((acc, { time, surgery }) => {
      const day = moment(time).format("YYYY-MM-DD");
      if (!acc[day]) acc[day] = [];
      acc[day].push({ time, surgery });
      return acc;
    }, {});

    for (const [day, surgeries] of Object.entries(scheduleByDate)) {
      for (const { time, surgery: surgeryCode } of surgeries) {
        const scheduledTime = moment(time);
        let resolvedTime = scheduledTime;
        let reasons = [];

        const surgeryDetails = allSurgeries.find((s) => s.code === surgeryCode);
        if (!surgeryDetails) {
          return {
            valid: false,
            message: `Invalid surgery code: ${surgeryCode}`,
          };
        }

        let dayConflict = false;

        // Instrument scheduling for this surgery on the given day
        for (const instrumentReq of surgeryDetails.instruments) {
          const instrumentId = instrumentReq._id._id.toString();
          const instrument = instrumentAvailability[instrumentId];

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
            if (instrument.totalQTY < instrumentReq.qty) {
              reasons.push(
                `Insufficient quantity of non-reusable instrument ${instrumentReq._id.name}`
              );
              dayConflict = true;
              break;
            }
            instrument.totalQTY -= instrumentReq.qty;
          }
        }

        if (dayConflict) {
          suggestedSchedule.push({
            time: scheduledTime.format("MM/DD/YYYY HH:mm"),
            surgery: surgeryCode,
            reason: "Conflict on this day. Try another day.",
          });
          continue;
        }

        // Supply scheduling for this surgery on the given day
        for (const supplyReq of surgeryDetails.supplies) {
          const supplyId = supplyReq._id._id.toString();
          const supply = supplyAvailability[supplyId];

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
            if (supply.totalQTY < supplyReq.qty) {
              reasons.push(
                `Insufficient quantity of non-reusable supply ${supplyReq._id.name}`
              );
              dayConflict = true;
              break;
            }
            supply.totalQTY -= supplyReq.qty;
          }
        }

        if (dayConflict) {
          suggestedSchedule.push({
            time: scheduledTime.format("MM/DD/YYYY HH:mm"),
            surgery: surgeryCode,
            reason: "Conflict on this day. Try another day.",
          });
          continue;
        }

        // Append the scheduled surgery with adjustments (if any)
        suggestedSchedule.push({
          time: resolvedTime.format("MM/DD/YYYY HH:mm"),
          surgery: surgeryCode,
          reason: reasons.length
            ? reasons.join("; ")
            : "Scheduled as requested",
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
