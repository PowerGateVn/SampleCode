import { IUserModel } from "models";

export interface IUserServices {
  login(email: string, password: string): Promise<IUserModel>;
}
