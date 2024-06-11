import express from "express";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Infor from "../models/inforModel.js";
import Training from "../models/trainingModel.js";
import { isAuth, isAdmin, generateToken, baseUrl } from "../utils.js";
import { transporter } from "../services/mailer.js";
import Working from "../models/workingModel.js";
import Research from "../models/researchModel.js";
import Prize from "../models/prizeModel.js";

const userRouter = express.Router();

userRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.get(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

userRouter.post(
  "/forget-password",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });
      user.resetToken = token;
      await user.save();

      //reset link
      console.log(`${baseUrl()}/reset-password/${token}`);

      const emailDetails = {
        from: `ShoesShop <${process.env.SMTP_MAIL}>`,
        to: `${user.name} <${user.email}>`,
        subject: `Reset Password`,
        html: `
             <p>Please Click the following link to reset your password:</p>
             <a href="${baseUrl()}/reset-password/${token}"}>Reset Password</a>
             `,
      };

      await transporter.sendMail(emailDetails);

      res.send({ message: "We sent reset password link to your email." });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

userRouter.post(
  "/reset-password",
  expressAsyncHandler(async (req, res) => {
    jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
      } else {
        const user = await User.findOne({ resetToken: req.body.token });
        if (user) {
          if (req.body.password) {
            user.password = bcrypt.hashSync(req.body.password, 8);
            await user.save();
            res.send({
              message: "Password reseted successfully",
            });
          }
        } else {
          res.status(404).send({ message: "User not found" });
        }
      }
    });
  })
);

userRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      const updatedUser = await user.save();
      res.send({ message: "User Updated", user: updatedUser });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === "admin@example.com") {
        res.status(400).send({ message: "Can Not Delete Admin User" });
        return;
      }
      await user.remove();
      res.send({ message: "User Deleted" });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });

    const user = await newUser.save();

    const newInfor = new Infor({
      userId: user._id,
    });
    await newInfor.save();

    const newResearch = new Research({
      userId: user._id,
    });
    await newResearch.save();

    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

userRouter.put(
  "/update-infor/:userId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const infor = await Infor.findOne({ userId: userId });

    if (infor) {
      infor.name = req.body.nameUser;
      infor.dateOfBirth = req.body.dateOfBirth;
      infor.gender = req.body.gender;
      infor.image = req.body.image;
      infor.email = req.body.emailUser;
      infor.scientificTitleVi = req.body.scientificTitleVi;
      infor.scientificTitleEn = req.body.scientificTitleEn;
      infor.citizenIdentification = req.body.citizenIdentification;
      infor.administrativePositionEn = req.body.administrativePositionEn;
      infor.administrativePositionVi = req.body.administrativePositionVi;
      infor.phone = req.body.phone;
      infor.officePhone = req.body.officePhone;
      infor.secondaryEmail = req.body.secondaryEmail;
      infor.branch = req.body.branch;
      infor.bank = req.body.bank;
      infor.fax = req.body.fax;
      infor.account = req.body.account;
      infor.tax = req.body.account;
      infor.train = req.body.train;
      infor.train2 = req.body.train2;
      infor.train3 = req.body.train3;
      infor.school = req.body.schoolAddress;
      infor.english = req.body.english;
      infor.languageOther = req.body.languageOther;
      await infor.save();
      res.send({ message: "User Information Updated" });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.get(
  "/user-infor/get-users",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const users = await Infor.find({});
    res.send(users);
  })
);

userRouter.get(
  "/user-infor/:userId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const infors = await Infor.findOne({ userId });
    res.send(infors);
  })
);

userRouter.get(
  "/user-trainings/:userId",
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const userTraining = await Training.findOne({ userId: userId });
    res.send(userTraining);
  })
);

userRouter.post(
  "/user-trainings/:userId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    const {
      trainingFacilityVi,
      trainingFacilityEn,
      address,
      time,
      majorVi,
      majorEn,
      degree,
      proofOfDegree,
      namePdf,
    } = req.body;

    const newTraining = {
      trainingFacilityVi,
      trainingFacilityEn,
      address,
      time,
      majorVi,
      majorEn,
      degree,
      proofOfDegree,
      namePdf,
    };

    let userTraining = await Training.findOne({ userId: userId });

    if (!userTraining) {
      userTraining = new Training({ userId, training: [] });
    }

    userTraining.training.push(newTraining);
    await userTraining.save();

    res.send({ message: "Add User Training Success" });
  })
);

userRouter.put(
  "/user-trainings/:userId/:trainingId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { userId, trainingId } = req.params;
    const {
      trainingFacilityVi,
      trainingFacilityEn,
      address,
      time,
      majorVi,
      majorEn,
      degree,
      proofOfDegree,
      namePdf,
    } = req.body;

    let userTraining = await Training.findOne({ userId: userId });

    if (!userTraining) {
      return res.send({ message: "User training not found" });
    }

    const trainingElement = userTraining.training.find(
      (item) => item._id === trainingId
    );

    if (!trainingElement) {
      return res.send({ message: "Training element not found" });
    }

    trainingElement.trainingFacilityVi = trainingFacilityVi;
    trainingElement.trainingFacilityEn = trainingFacilityEn;
    trainingElement.address = address;
    trainingElement.time = time;
    trainingElement.majorVi = majorVi;
    trainingElement.majorEn = majorEn;
    trainingElement.degree = degree;
    trainingElement.proofOfDegree = proofOfDegree;
    trainingElement.namePdf = namePdf;

    await userTraining.save();

    res.send({ message: "Update User Training Success" });
  })
);

userRouter.get(
  "/user-workings/:userId",
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const userWorking = await Working.findOne({ userId: userId });
    res.send(userWorking);
  })
);

userRouter.post(
  "/user-workings/:userId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { workingAgency, position, note } = req.body;

    const newWorking = {
      workingAgency,
      position,
      note,
    };

    let userWorking = await Working.findOne({ userId: userId });

    if (!userWorking) {
      userWorking = new Working({ userId, working: [] });
    }

    userWorking.working.push(newWorking);
    await userWorking.save();

    res.send({ message: "Add User Working Success" });
  })
);

userRouter.put(
  "/user-workings/:userId/:trainingId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { userId, trainingId } = req.params;
    const { workingAgency, position, note } = req.body;

    let userWorking = await Working.findOne({ userId: userId });

    if (!userWorking) {
      return res.send({ message: "User working not found" });
    }

    const workingElement = userWorking.working.find(
      (item) => item._id === trainingId
    );

    if (!workingElement) {
      return res.send({ message: "Working element not found" });
    }

    workingElement.workingAgency = workingAgency;
    workingElement.position = position;
    workingElement.note = note;

    await userWorking.save();

    res.send({ message: "Update User Working Success" });
  })
);

userRouter.get(
  "/user-researches/:userId",
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const userResearch = await Research.findOne({ userId: userId });
    res.send(userResearch);
  })
);

userRouter.put(
  "/user-researches/:userId/main-research",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { mainResearch } = req.body;

    let userResearch = await Research.findOne({ userId: userId });

    if (!userResearch) {
      userResearch = new Research({ userId, mainResearch: {} });
    }

    userResearch.mainResearch = mainResearch;

    await userResearch.save();

    res.send({ message: "Update User Working Success" });
  })
);

userRouter.post(
  "/user-researches/:userId/list-research",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.userId;

    console.log(userId);
    const {
      name,
      sponsoringOrganization,
      address,
      website,
      role,
      time,
      expense,
      addInfor,
    } = req.body;

    const newListTopic = {
      name,
      sponsoringOrganization,
      address,
      website,
      role,
      time,
      expense,
      addInfor,
    };

    let userResearch = await Research.findOne({ userId: userId });

    if (!userResearch) {
      userResearch = new Research({ userId, listTopics: [] });
    }

    userResearch.listTopics.push(newListTopic);

    await userResearch.save();

    res.send({ message: "Add List Research Success" });
  })
);

userRouter.put(
  "/user-researches/:userId/:listResearchId/list-research",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { userId, listResearchId } = req.params;

    console.log(listResearchId);

    const {
      name,
      sponsoringOrganization,
      address,
      website,
      role,
      time,
      expense,
      addInfor,
    } = req.body;

    let userResearch = await Research.findOne({ userId: userId });

    if (!userResearch) {
      return res.send({ message: "User Research not found" });
    }

    const listResearchElement = userResearch.listTopics.find(
      (item) => item._id === listResearchId
    );

    listResearchElement.name = name;
    listResearchElement.sponsoringOrganization = sponsoringOrganization;
    listResearchElement.address = address;
    listResearchElement.website = website;
    listResearchElement.role = role;
    listResearchElement.time = time;
    listResearchElement.expense = expense;
    listResearchElement.addInfor = addInfor;

    await userResearch.save();

    res.send({ message: "Update List Research Success" });
  })
);

userRouter.post(
  "/user-researches/:userId/result-research",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.userId;

    const {
      name,
      author,
      magazineName,
      typeResearch,
      year,
      issn,
      namePdf,
      proofOfDegree,
      note,
    } = req.body;

    const newResult = {
      name,
      author,
      magazineName,
      typeResearch,
      year,
      issn,
      namePdf,
      proofOfDegree,
      note,
    };

    let userResearch = await Research.findOne({ userId: userId });

    if (!userResearch) {
      userResearch = new Research({ userId, results: [] });
    }

    userResearch.results.push(newResult);

    await userResearch.save();

    res.send({ message: "Add Result Research Success" });
  })
);

userRouter.put(
  "/user-researches/:userId/:resultId/result-research",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { userId, resultId } = req.params;

    console.log(resultId);

    const {
      name,
      author,
      magazineName,
      typeResearch,
      year,
      issn,
      namePdf,
      proofOfDegree,
      note,
    } = req.body;

    console.log(proofOfDegree);

    let userResearch = await Research.findOne({ userId: userId });

    if (!userResearch) {
      return res.send({ message: "User Research Result not found" });
    }

    const resultElement = userResearch.results.find(
      (item) => item._id === resultId
    );

    resultElement.name = name;
    resultElement.author = author;
    resultElement.magazineName = magazineName;
    resultElement.typeResearch = typeResearch;
    resultElement.year = year;
    resultElement.issn = issn;
    resultElement.namePdf = namePdf;
    resultElement.proofOfDegree = proofOfDegree;
    resultElement.note = note;

    await userResearch.save();

    res.send({ message: "Update Result Research Success" });
  })
);

userRouter.get(
  "/user-prizes/:userId",
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const userPrize = await Prize.findOne({ userId: userId });
    res.send(userPrize);
  })
);

userRouter.post(
  "/user-prizes/:userId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.userId;

    const { content, year } = req.body;

    const newPrize = {
      content,
      year,
    };

    let userPrize = await Prize.findOne({ userId: userId });

    if (!userPrize) {
      userPrize = new Prize({ userId, prizes: [] });
    }

    userPrize.prizes.push(newPrize);

    await userPrize.save();

    res.send({ message: "Add User Prize Success" });
  })
);

userRouter.put(
  "/user-prizes/:userId/:prizeId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { userId, prizeId } = req.params;

    const { content, year } = req.body;

    let userPrize = await Prize.findOne({ userId: userId });

    if (!userPrize) {
      return res.send({ message: "User Prize not found" });
    }

    const prizeElement = userPrize.prizes.find((item) => item._id === prizeId);

    prizeElement.content = content;
    prizeElement.year = year;

    await userPrize.save();

    res.send({ message: "Update User Prize Success" });
  })
);

export default userRouter;
