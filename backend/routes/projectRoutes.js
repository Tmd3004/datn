import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAuth, isAdmin, generateToken, baseUrl } from "../utils.js";
import ProjectPropose from "../models/projectProposeModel.js";

const projectRouter = express.Router();

projectRouter.get(
  "/",
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const projects = await ProjectPropose.find();
    res.send(projects);
  })
);

projectRouter.get(
  "/:projectId",
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const projects = await ProjectPropose.find({ _id: projectId });
    res.send(projects);
  })
);

projectRouter.get(
  "/user-project/:userId",
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    const projects = await ProjectPropose.find({ userId: userId });
    res.send(projects);
  })
);

projectRouter.post(
  "/create",
  // isAdmin,
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const {
      userId,
      topicNameVi,
      topicNameEn,
      monthOfTopic,
      role,
      email,
      name,
      workingAgency,
      scientificTitleVi,
      topic,
    } = req.body;

    if (!topicNameVi || !topicNameEn) {
      return res
        .status(400)
        .json({ message: "topicNameVi and topicNameEn are required" });
    }

    const newProjectPropose = new ProjectPropose({
      userId: userId,
      inforGeneral: {
        topicNameVi,
        topicNameEn,
      },
      expectedResult: {},
      members: [
        {
          userId,
          role,
          monthOfTopic,
          name,
          email,
          workingAgency,
          scientificTitleVi,
        },
      ],
      present: {},
      topic: topic,
    });

    const savedProjectPropose = await newProjectPropose.save();

    res.json({ id: savedProjectPropose._id });
  })
);

projectRouter.put(
  "/:projectId/infor-general",
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const {
      topicNameVI,
      topicNameEN,
      topicSummary,
      topicType,
      researchTime,
      fundingSchool,
      fundingPersonal,
      fundingFull,
      hostOrganization,
    } = req.body;

    let project = await ProjectPropose.findOne({ _id: projectId });

    if (!project) {
      return res.send({ message: "User training not found" });
    }

    const inforGeneralElelment = project.inforGeneral;

    inforGeneralElelment.topicNameVi = topicNameVI;
    inforGeneralElelment.topicNameEn = topicNameEN;
    inforGeneralElelment.topicSummary = topicSummary;
    inforGeneralElelment.topicType = topicType;
    inforGeneralElelment.researchTime = researchTime;
    inforGeneralElelment.fundingSchool = fundingSchool;
    inforGeneralElelment.fundingPersonal = fundingPersonal;
    inforGeneralElelment.fundingFull = fundingFull;
    inforGeneralElelment.hostOrganization = hostOrganization;

    await project.save();

    res.send({ message: "Update User Training Success" });
  })
);

projectRouter.put(
  "/:projectId/expected-results",
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { projectId } = req.params;

    console.log(projectId);

    const { train, projectAnnounced } = req.body;

    let project = await ProjectPropose.findOne({ _id: projectId });

    if (!project) {
      return res.send({ message: "User training not found" });
    }

    const expectedResultElelment = project.expectedResult;

    console.log(expectedResultElelment);

    expectedResultElelment.train = train;
    expectedResultElelment.projectAnnounced = projectAnnounced;

    await project.save();

    res.send({ message: "Update User Training Success" });
  })
);

projectRouter.post(
  "/:projectId/add-member",
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const {
      userId,
      name,
      email,
      workingAgency,
      role,
      monthOfTopic,
      scientificTitleVi,
    } = req.body;

    const newMember = {
      userId,
      name,
      email,
      workingAgency,
      role,
      monthOfTopic,
      scientificTitleVi,
    };

    let project = await ProjectPropose.findOne({ _id: projectId });

    if (!project) {
      return res.send({ message: "Project not found" });
    }

    project.members.push(newMember);

    await project.save();

    res.send({ message: "Add Member Success!" });
  })
);

projectRouter.put(
  "/:projectId/edit-member/:memberId",
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { projectId, memberId } = req.params;

    const {
      name,
      email,
      workingAgency,
      role,
      monthOfTopic,
      scientificTitleVi,
    } = req.body;

    let project = await ProjectPropose.findOne({ _id: projectId });

    if (!project) {
      return res.send({ message: "Project not found" });
    }

    const memberElement = project.members.find((item) => item._id === memberId);

    memberElement.name = name;
    memberElement.email = email;
    memberElement.workingAgency = workingAgency;
    memberElement.role = role;
    memberElement.monthOfTopic = monthOfTopic;
    memberElement.scientificTitleVi = scientificTitleVi;

    await project.save();

    res.send({ message: "Add Member Success!" });
  })
);

projectRouter.put(
  "/:projectId/presents",
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const { presentVi, presentEn, fundingVi, fundingEn } = req.body;

    let project = await ProjectPropose.findOne({ _id: projectId });

    if (!project) {
      return res.send({ message: "Project not found" });
    }

    const presentElelment = project.present;

    presentElelment.presentVi = presentVi;
    presentElelment.presentEn = presentEn;
    presentElelment.fundingVi = fundingVi;
    presentElelment.fundingEn = fundingEn;

    await project.save();

    res.send({ message: "Update User Training Success" });
  })
);

projectRouter.put(
  "/:projectId/update-status",
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const { status } = req.body;

    const validStatuses = ["propose", "handle", "accept"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    let project = await ProjectPropose.findOne({ _id: projectId });

    if (!project) {
      return res.send({ message: "Project not found" });
    }

    project.status = status;

    await project.save();

    res.send({ message: "Update User Training Success" });
  })
);

projectRouter.put(
  "/:projectId/accept-topic",
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const {
      status,
      reviewDay,
      userID,
      name,
      email,
      workingAgency,
      scientificTitleVi,
      reviewMessage,
    } = req.body;

    const validStatuses = ["propose", "handle", "accept"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    let project = await ProjectPropose.findOne({ _id: projectId });

    if (!project) {
      return res.send({ message: "Project not found" });
    }

    project.status = status;
    project.reviewDay = reviewDay;
    project.reviews.push({
      userId: userID,
      name,
      email,
      workingAgency,
      scientificTitleVi,
      review: reviewMessage,
    });

    await project.save();

    res.send({ message: "Update User Training Success" });
  })
);

export default projectRouter;
