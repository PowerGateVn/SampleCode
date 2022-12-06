import PlusCodeController from "@src/controllers/plusCode.controller";
import { Router } from "express";

export default class PlusCodeRouter {
  public router: Router = Router();
  private _plusCodeController = new PlusCodeController();

  constructor() {
    this.config();
  }

  private config() {
    this.router.get("/findAll", this._plusCodeController.findAll);
  }
}
