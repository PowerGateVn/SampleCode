import PlusCodeBusiness from "@src/businessLogic/plusCode.business";
import { NextFunction, Request, Response } from "express";

export default class PlusCodeController {
  public async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const plusCodeBusiness = new PlusCodeBusiness();
      const result = await plusCodeBusiness.findAll();
      res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  }
}
