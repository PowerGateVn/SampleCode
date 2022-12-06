import cors from "cors";
import express from "express";
import "module-alias/register";
import { json, urlencoded } from "body-parser";
import routes from "@src/routes";
import { errorMiddleware } from "@src/middlewares/error.middleware";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private config() {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use("/", routes);
    this.app.use(errorMiddleware);
  }
}

export default new App().app;
