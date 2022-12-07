import { Router } from 'express';

export default abstract class BaseRouter {
  public router: Router;

  constructor() {
    this.router = Router();
  }

  abstract config(): void;
}