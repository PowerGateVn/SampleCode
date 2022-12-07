import { body } from "express-validator";

const passwordRules = [
  body("password").isString(),
  body("password").isLength({
    min: 6,
    max: 32,
  }),
];

export const login = [body("username").isString(), body("password").isString()];

export const register = [
  body("fullname").isString(),
  body("username").isString(),
  ...passwordRules,
];
