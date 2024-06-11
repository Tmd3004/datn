import mongoose from "mongoose";

const inforSchema = new mongoose.Schema(
  {
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    image: {type: String},
    name: { type: String },
    email: { type: String },
    dateOfBirth: { type: String },
    gender: { type: String },
    scientificTitleVi: { type: String },
    scientificTitleEn: { type: String },
    citizenIdentification: { type: String },
    administrativePositionVi: { type: String },
    administrativePositionEn: { type: String },
    phone: { type: String },
    officePhone: { type: String },
    secondaryEmail: { type: String },
    branch: { type: String },
    bank: { type: String },
    fax: { type: String },
    account: { type: String },
    tax: { type: String },
    train: {
      science: String,
      major: String,
      code: String,
    },
    train2: {
      science: String,
      major: String,
      code: String,
    },
    train3: {
      science: String,
      major: String,
      code: String,
    },

    school: {
      name: String,
      nameVi: String,
      nameEn: String,
      address: String,
      city: String,
      department: String,
    },
    english: {
      read: String,
      write: String,
      speak: String,
    },
    languageOther: {
      name: String,
      read: String,
      write: String,
      speak: String,
    },
  },
  {
    timestamps: true,
  }
);

const Infor = mongoose.model("Infor", inforSchema);
export default Infor;
