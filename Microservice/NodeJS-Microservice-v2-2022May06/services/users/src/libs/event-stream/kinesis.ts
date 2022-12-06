import AWS from "aws-sdk";
import { v4 } from "uuid";
import IEventStream from "./event-stream";

export default class Kinesis implements IEventStream {
  async putMessage(action: string, data: any) {
    const kinesis = new AWS.Kinesis();
    const partitionKey = v4();
    const params = {
      Data: JSON.stringify(data),
      PartitionKey: partitionKey,
      StreamName: action,
    };

    const putRecord = await kinesis.putRecord(params).promise();
    console.log("Stream result", putRecord);
  }

  getPayload(event: any): object {
    const [record] = event.Records;
    const payload = Buffer.from(record.kinesis.data, "base64").toString();
    return JSON.parse(payload);
  }
}
