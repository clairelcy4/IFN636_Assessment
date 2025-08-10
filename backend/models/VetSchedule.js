import mongoose from "mongoose";

const vetScheduleSchema = new mongoose.Schema(
  {
    vetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vet",
      required: true,
    },
    scheduleType: {
      type: String,
      enum: ["work", "off", "booked"],
      required: true,
    },
    // off, booked == not available ; work == available
    available: {
      type: Boolean,
      default: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// scheduleType : work == available
vetScheduleSchema.pre("save", function (next) {
  this.available = this.scheduleType === "work";
  next();
});

vetScheduleSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.scheduleType) {
    update.available = update.scheduleType === "work";
  }
  next();
});

export default mongoose.model("VetSchedule", vetScheduleSchema);
