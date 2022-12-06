import uuid from 'uuid';
import { create } from '../repositories/user';
import AWS from "../../../../libs/aws-sdk";
import config from "../../../../config";

export async function createUser(data) {
  try {
    const user = {
      id: uuid.v1(),
      name: data.name,
      content: data.content,
      email: data.email,
      createdAt: Date.now(),
    };
    const newUser = await create(user);
    return newUser;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
export async function sendVerificationMsg(user) {
    // Send verification message s
    const sns = new AWS.SNS();
    const TopicArn = `arn:aws:sns:${config.region}:${config.accountId}:after-created-user-${config.stage}`;
    await sns
    .publish({
        Message: JSON.stringify(user),
        MessageStructure: "string",
        TopicArn
        // TopicArn: `arn:aws:sns:us-east-1:706512677771:after-created-user-${config.stage}`,
    })
    .promise();
}

export async function sendViaKinesis(user) {
  const kinesis = new AWS.Kinesis();

  const partitionKey = uuid.v1();
  const params = {
    Data: JSON.stringify(user),
    PartitionKey: partitionKey,
    StreamName: `data-receiver-${config.stage}`
  };

  // return kinesis.putRecord(params, (error, data) => {
  //   if (error) {
  //     callback(error);
  //   }
  //   callback(null, { message: 'Data successfully written to Kinesis stream "data-receiver"' });
  // });
  const putRecord = await kinesis.putRecord(params).promise();
  console.log(putRecord);
}
