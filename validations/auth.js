import { body } from "express-validator";

export const registerValidation = [
  body("email", "Not valid email").isEmail(),
  body("password", "Min 5 let").isLength({ min: 5 }),
  body("fullName", "Enter Name").isLength({ min: 3 }),
  body("avatarUrl", "Not valid URL").optional().isURL(),
];
