import mongoose from "mongoose";

const inforGeneralSchema = new mongoose.Schema(
  {
    topicNameVi: String,
    topicNameEn: String,
    topicSummary: String,
    topicType: String,
    researchTime: Number,
    fundingSchool: Number,
    fundingPersonal: Number,
    fundingFull: String,
    hostOrganization: {
      organizationName: String,
      organizationNameEn: String,
      address: String,
      city: String,
      email: String,
      representative: String,
      position: String,
      phone: String,
    },
  },
  {
    timestamps: true,
  }
);

const expectedResultSchema = new mongoose.Schema(
  {
    train: {
      master: {
        total: Number,
        note: String,
      },
      PhD: {
        total: Number,
        note: String,
      },
    },
    projectAnnounced: {
      ISOReputation: {
        total: Number,
        note: String,
      },
      internationalReputation: {
        total: Number,
        note: String,
      },
      internationalOther: {
        total: Number,
        note: String,
      },
      nationReputation: {
        total: Number,
        note: String,
      },
      nationalConference: {
        total: Number,
        note: String,
      },
      monographic: {
        total: Number,
        note: String,
      },
      other: {
        total: Number,
        note: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const memberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: String,
    email: { type: String },
    workingAgency: String,
    role: String,
    monthOfTopic: Number,
    scientificTitleVi: String,
  },
  {
    timestamps: true,
  }
);

const presentSchema = new mongoose.Schema(
  {
    presentVi: String,
    presentEn: String,
    fundingVi: String,
    fundingEn: String,
  },
  {
    timestamps: true,
  }
);

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: String,
  email: { type: String },
  workingAgency: String,
  scientificTitleVi: String,
  review: String,
});

const userProjectPropose = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  inforGeneral: inforGeneralSchema,
  expectedResult: expectedResultSchema,
  members: [memberSchema],
  present: presentSchema,
  status: {
    type: String,
    enum: ["propose", "handle", "accept"],
    default: "propose",
  },
  topic: { type: String, enum: ["school", "faculty", "other"] },
  reviewDay: { type: String },
  reviews: [reviewSchema],
});

const ProjectPropose = mongoose.model("ProjectPropose", userProjectPropose);
export default ProjectPropose;
