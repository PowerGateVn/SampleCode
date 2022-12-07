import { config } from "dotenv";
import path from "path";
const envFound = config({
  path: path.resolve(
    __dirname,
    `../../.env.${process.env.NODE_ENV || "development"}`
  ),
});
if (!envFound) throw new Error("Couldn't find .env file");
