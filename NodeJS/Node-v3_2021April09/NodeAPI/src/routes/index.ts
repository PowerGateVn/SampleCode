import { Router } from "express";
import PlusCodeRouter from "./plusCode.route";

class MainRoutes {
  public routers: Router;

  constructor() {
    this.routers = Router();
    this.config();
  }

  private config() {
    this.routers.use("/plusCode", new PlusCodeRouter().router);
  }
}

export default new MainRoutes().routers;
