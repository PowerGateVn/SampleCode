import { Context, Handler } from "aws-lambda";
import { StatusCodes } from "http-status-codes";
import { KINESIS_ACTION } from "../configs/config";
import UserDto from "../dtos/user.dto";
import * as validate from "../utils/validate.util";
import UserService from "../services/user.service";
import EventStream from "../libs/event-stream";
import { getBody } from "../utils/request.util";
import { success, error } from "../utils/response.util";

export const create: Handler = async (event: any, context: Context) => {
  try {
    const data = getBody(event);
    const { status, message } = await validate.createUser(data);
    if (!status) {
      return error(message, StatusCodes.BAD_REQUEST);
    }

    const userService = new UserService();
    const user: UserDto = await userService.create(data.name, data.email);
    const eventStream = new EventStream();
    await eventStream.putMessage(KINESIS_ACTION.SEND_EMAIL, user);
    return success(user);
  } catch (e: any) {
    return error(e.message);
  }
};
