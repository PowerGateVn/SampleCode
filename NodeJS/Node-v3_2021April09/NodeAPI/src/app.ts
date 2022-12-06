import { json, urlencoded } from "body-parser";
import express from "express";
import { errorMiddleware, notFoundMiddleware } from "./middleware";
import routes from "./routes";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private config() {
    /** support application/json type post data */
    this.app.use(json());
    /** support application/x-www-form-urlencoded post data */
    this.app.use(urlencoded({ extended: true }));
    /** add routes */
    this.app.use("/api/v1", routes);
    /** not found error */
    this.app.use(notFoundMiddleware);
    /** internal server Error  */
    this.app.use(errorMiddleware);
  }
}

export default new App().app;
