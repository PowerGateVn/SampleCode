import { Context, Handler } from "aws-lambda";
import { mailTo } from "../utils/notify.util";
import { getPayload } from "../utils/request.util";

export const sendEmail: Handler = async (event: any, context: Context) => {
  try {
    const { email } = getPayload(event);
    return mailTo(email, "New User", `${email} is added!`);
  } catch (err) {
    return { status: false };
  }
};
