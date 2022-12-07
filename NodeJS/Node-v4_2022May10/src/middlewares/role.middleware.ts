import { Request, Response, NextFunction } from "express";

import { verifyToken } from "@src/helpers/auth.helper";
import { UnauthorizedException } from "@src/helpers/exception.helper";

export const isLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const user = await verifyToken(token);
      res.locals.user = user;
      next();
    } catch (error) {
      next(new UnauthorizedException());
    }
  } else {
    next(new UnauthorizedException());
  }
};
