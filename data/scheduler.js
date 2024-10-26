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

    let instrumentAvailability = {};

    allInstruments.forEach((inst) => {
      instrumentAvailability[inst._id.toString()] = {
        totalQTY: inst.totalQTY,
        reusable: inst.reusable,
        sterilizationTime: inst.sterilizationTime,
        nextAvailableTime: moment(), // Start availability from the current time
      };
    });

    let suggestedSchedule = [];

    for (let i = 0; i < schedule.length; i++) {
      const { time, surgery: surgeryCode } = schedule[i];
      let scheduledTime = moment(time);
      let reasons = [];

      const surgeryDetails = allSurgeries.find((s) => s.code === surgeryCode);
      if (!surgeryDetails) {
        return {
          valid: false,
          message: `Invalid surgery code: ${surgeryCode}`,
        };
      }

      let resolvedTime = scheduledTime;

      surgeryDetails.instruments.forEach((instrumentReq) => {
        const instrumentId = instrumentReq._id._id.toString();
        const instrument = instrumentAvailability[instrumentId];

        if (!instrument) {
          throw new Error(`Instrument with ID ${instrumentId} is missing from inventory.`);
        }

        if (instrument.reusable) {
          const readyTime = instrument.nextAvailableTime.clone().add(instrument.sterilizationTime, "minutes");

          if (readyTime.isAfter(resolvedTime)) {
            reasons.push(`Adjusted due to sterilization time of instrument ${instrumentReq._id.name}`);
            resolvedTime = moment.max(resolvedTime, readyTime);
          }

          instrument.nextAvailableTime = resolvedTime.clone().add(surgeryDetails.expectedDuration, "minutes");
        } else {
          if (instrument.totalQTY < instrumentReq.qty) {
            reasons.push(`Adjusted due to insufficient quantity of non-reusable instrument ${instrumentReq._id.name}`);
            throw new Error(`Not enough quantity for instrument ${instrumentId}. Required: ${instrumentReq.qty}, Available: ${instrument.totalQTY}.`);
          }

          instrument.totalQTY -= instrumentReq.qty;
        }
      });

      suggestedSchedule.push({
        time: resolvedTime.format("MM/DD/YYYY HH:mm"),
        surgery: surgeryCode,
        reason: reasons.length ? reasons.join("; ") : "Scheduled as requested",
      });
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
      message: error.message || "An error occurred while suggesting the schedule.",
    };
  }
};
