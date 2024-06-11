import mongoose from "mongoose";

const listTopicSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    name: {
      vi: String,
      en: String,
    },
    sponsoringOrganization: {
      vi: String,
      en: String,
    },
    address: String,
    website: String,
    role: {
      vi: String,
      en: String,
    },
    time: {
      begin: String,
      end: String,
    },
    expense: {
      money: Number,
      typeMoney: String,
    },
    addInfor: String,
  },
  {
    timestamps: true,
  }
);

const resultSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    name: String,
    author: String,
    magazineName: String,
    typeResearch: String,
    year: String,
    issn: String,
    proofOfDegree: String,
    namePdf: String,
    note: String,
  },
  {
    timestamps: true,
  }
);

const userResearchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mainResearch: {
    vi: String,
    en: String,
  },
  listTopics: [listTopicSchema],
  results: [resultSchema],
});

const Research = mongoose.model("research", userResearchSchema);
export default Research;
