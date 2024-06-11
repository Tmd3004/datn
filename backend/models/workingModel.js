import mongoose from "mongoose";

const workingSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    workingAgency: {
      vi: String,
      en: String,
      address: String,
      phone: String,
      time: {
        begin: String,
        end: String,
      },
    },
    position: {
      vi: String,
      en: String,
    },
    note: String,
  },
  {
    timestamps: true,
  }
);

const userWorkingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  working: [workingSchema],
});

const Working = mongoose.model("working", userWorkingSchema);
export default Working;
