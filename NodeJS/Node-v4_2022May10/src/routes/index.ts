import { Router } from "express";
import AuthRouter from "./auth.routes";
import UserRouter from "./user.routes";

class MainRoutes {
  public routers: Router;

  constructor() {
    this.routers = Router();
    this.config();
  }

  private config() {
    this.routers.use("/auth", new AuthRouter().router);
    this.routers.use("/user", new UserRouter().router);
  }
}

export default new MainRoutes().routers;
