import { NextFunction, Request, Response } from "express";

import MESSAGE from "@src/constants/message.constant";
import BaseController from "@src/controllers/base.controller";
import { UserService } from "@src/services/user.service";
import {
  isErrorValidate,
  handleErrorException,
} from "@src/helpers/utils.helper";
import {
  hasPassword,
  generateToken,
  getSafeUserInfo,
  comparePassword,
} from "@src/helpers/auth.helper";
import { BadRequestException } from "@src/helpers/exception.helper";

class AuthController extends BaseController {
  public userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (isErrorValidate(req)) {
        return next(new BadRequestException(isErrorValidate(req)));
      }

      const { username, password } = req.body;
      const user = await this.userService.getByUsername(username);
      if (!user || !(await comparePassword(password, user.password))) {
        return next(new BadRequestException(MESSAGE.USER_NOT_EXISTED));
      }

      const token = generateToken(user);
      return this.resService.ok(res, {
        token,
        user: getSafeUserInfo(user),
      });
    } catch (e) {
      next(e);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (isErrorValidate(req)) {
        return next(new BadRequestException(isErrorValidate(req)));
      }

      const { fullname, username, password } = req.body;
      if (await this.userService.isExistUsername(username)) {
        return next(new BadRequestException(MESSAGE.USER_EXISTED));
      }

      const user = await this.userService.create({
        fullname,
        username,
        password: await hasPassword(password),
      });

      this.resService.ok(res, user);
    } catch (e) {
      next(e);
    }
  };
}

export default AuthController;
