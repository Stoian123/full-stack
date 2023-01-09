import express, { request, response } from "express";
import mongoose from "mongoose";

import {
  registerValidation,
  loginValidation,
  posrCreateValidation,
} from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

mongoose
  .connect(
    "mongodb+srv://admin:Qwerty123@cluster0.uustauv.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB Conected");
  })
  .catch((err) => console.log("DB ERROR", err));

const app = express();

app.use(express.json()); // Read Json from POST REQUEST

app.post("/auth/login", loginValidation, UserController.login);
app.post("/auth/register", registerValidation, UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);
app.get("/posts/:id", PostController.getOne);
app.get("/posts", PostController.getAll);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, PostController.update);
app.post("/posts", checkAuth, posrCreateValidation, PostController.create);

app.listen("4444", (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Loaded...");
});
