import AWS from "../../libs/aws-sdk";
import config from "../../config";

export async function main(event, context) {
  // Parse SNS data
  const { email, name } = JSON.parse(event.Records[0].Sns.Message);
  const msg = `New user ${name} has created ${email}`;
  await sendsms(msg);
  return { status: true };
}

export async function kinesis(event, context) {
  const payload = new Buffer(event.Records[0].kinesis.data, 'base64').toString('ascii');
  const data = JSON.parse(payload);
  console.log(data);
  const { email, id } = data;
  const msg = `user id: ${id}, email: ${email} has updated using kinesis.`;
  await sendsms(msg);
  return { status: true };
}

async function sendsms(msg) {
  const sns = new AWS.SNS();
  await sns
  .publish({
    Message: msg,
    PhoneNumber: config.adminPhoneNumber
  })
  .promise();
}
