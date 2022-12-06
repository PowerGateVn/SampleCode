import { NextFunction, Request, Response } from "express";

import BaseController from "@src/controllers/base.controller";
import { UserService } from "@src/services/user.service";
import { getSafeUserInfo } from "@src/helpers/auth.helper";

class UserController extends BaseController {
  userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;
    try {
      const userInfo = await this.userService.getById(user.id);
      if (userInfo) {
        this.resService.ok(res, getSafeUserInfo(userInfo));
      } else {
        this.resService.ok(res, {});
      }
    } catch (e) {
      next(e);
    }
  };
}

export default UserController;
