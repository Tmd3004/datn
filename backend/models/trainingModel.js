import mongoose from "mongoose";

const trainingSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString()},
    trainingFacilityVi: { type: String },
    trainingFacilityEn: { type: String },
    address: { type: String },
    time: {
      begin: String,
      end: String,
    },
    majorVi: String,
    majorEn: String,
    degree: {
      Vi: String,
      En: String,
    },
    proofOfDegree: String,
    namePdf: String
  },
  {
    timestamps: true,
  }
);

const userTrainingSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    training: [trainingSchema],
})

const Training = mongoose.model("Training", userTrainingSchema);
export default Training;
