import { Context, Handler } from "aws-lambda";
import { getQuery } from "../utils/request.util";
import { error, success } from "../utils/response.util";
import UserService from "../services/user.service";

export const list: Handler = async (event: any, context: Context) => {
  try {
    const query = getQuery(event);
    const limit = query?.limit;
    const token = query?.token;
    const userService = new UserService();
    const listUser = await userService.list(limit, token);
    return success(listUser);
  } catch (e: any) {
    return error(e.message);
  }
};
