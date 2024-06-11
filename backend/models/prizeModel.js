import mongoose from "mongoose";

const prizeSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    content: { type: String },
    year: { type: String },
  },
  {
    timestamps: true,
  }
);

const userPrize = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  prizes: [prizeSchema],
});

const Prize = mongoose.model("Prize", userPrize);
export default Prize;
