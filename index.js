import express, { request, response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { validationResult } from "express-validator";

import { registerValidation } from "./validations/auth.js";
import UserModel from "./models/User.js";
import checkAuth from "./utils/checkAuth.js";

mongoose
  .connect(
    "mongodb+srv://admin:Qwerty123@cluster0.uustauv.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB Conected");
  })
  .catch((err) => console.log("DB ERROR"));

const app = express();

app.use(express.json()); // Read Json from POST REQUEST

app.post("/auth/login", async (request, response) => {
  try {
    const user = await UserModel.findOne({ email: request.body.email });

    if (!user) {
      return response.status(404).json({
        // message: "Not Valid Email or Password",
        message: "User not found",
      });
    }

    const isValidPass = await bcrypt.compare(
      request.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return response.status(404).json({
        message: "Not Valid Email or Password",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret987",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    response.json({
      userData,
      token,
    });
  } catch (err) {
    console.log(err);
    response.status(500).json({
      message: "Cant login",
    });
  }
});

app.post("/auth/register", registerValidation, async (request, response) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json(errors.array());
    }

    const password = request.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: request.body.email,
      fullName: request.body.fullName,
      avatarUrl: request.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret987",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    response.json({
      userData,
      token,
    });
  } catch (err) {
    console.log(err);
    response.status(500).json({
      message: "Cant register",
    });
  }
});

app.get("/auth/me", checkAuth, async (request, response) => {
  try {
    const user = await UserModel.findById(request.userId);

    if (!user) {
      return response.status(404).json({
        message: "User not found",
      });
    }

    const { passwordHash, ...userData } = user._doc;

    response.json(userData);
  } catch (err) {
    console.log(err);
    response.status(500).json({
      message: "No Access",
    });
  }
});

app.listen("4444", (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Loaded...");
});
