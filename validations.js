import { body } from "express-validator";

export const loginValidation = [
  body("email", "Not valid email").isEmail(),
  body("password", "Min 5 let").isLength({ min: 5 }),
];

export const registerValidation = [
  body("email", "Not valid email").isEmail(),
  body("password", "Min 5 let").isLength({ min: 5 }),
  body("fullName", "Enter Name").isLength({ min: 3 }),
  body("avatarUrl", "Not valid URL").optional().isURL(),
];

export const posrCreateValidation = [
  body("title", "Enter title").isLength({ min: 3 }).isString(),
  body("text", "Enter text").isLength({ min: 3 }).isString(),
  body("tags", "Enter tags(Array)").optional().isString(),
  body("imageUrl", "Not valid URL").optional().isString(),
];
