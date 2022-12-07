import BaseRouter from "./base.routes";
import UserController from "@src/controllers/user.controller";
import { isLogin } from "@src/middlewares/role.middleware";

export default class UserRouter extends BaseRouter {
  public userCtrl: UserController;

  constructor() {
    super();
    this.userCtrl = new UserController();
    this.config();
  }

  config() {
    this.router.get("/info", isLogin, this.userCtrl.getUserInfo);
  }
}
