import aws from "aws-sdk";
import { EMAIL_SOURCE_SES } from "../configs/config";

export const mailTo = (email: string, subject: string, content: string) => {
  const ses = new aws.SES({ region: "us-west-1" });
  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: { Data: content },
      },

      Subject: { Data: subject },
    },
    Source: EMAIL_SOURCE_SES,
  };

  return ses.sendEmail(params).promise();
};
