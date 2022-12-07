import { IUserModel } from "models";
import { postService } from "services/config";
import { IUserServices } from "./interface";

export default class UserServices implements IUserServices {
  public async login(email: string, password: string): Promise<IUserModel> {
    try {
      return await postService("/login", { email, password }, "Login Fail", false);
    } catch (error) {
      throw error;
    }
  }
}
