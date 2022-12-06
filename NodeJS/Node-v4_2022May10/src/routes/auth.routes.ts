import BaseRouter from "./base.routes";
import AuthController from "@src/controllers/auth.controller";
import * as validate from "@src/helpers/validate.helper";

export default class AuthRouter extends BaseRouter {
  public authCtrl: AuthController;

  constructor() {
    super();
    this.authCtrl = new AuthController();
    this.config();
  }

  config() {
    this.router.post("/login", validate.login, this.authCtrl.login);
    this.router.post("/register", validate.register, this.authCtrl.register);
  }
}
