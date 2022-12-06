import AWS from "../../../../libs/aws-sdk";
import { success, failure } from '../../../../libs/response-lib';
import uuid from 'uuid';
import config from "../../../../config";

export async function main(event, context, callback) {
  try {
    const kinesis = new AWS.Kinesis();
    // const userList = [
    //   { name: 'json1', email: 'json1@gmail.com'},
    //   { name: 'json2', email: 'json2@gmail.com'},
    //   { name: 'json3', email: 'json3@gmail.com'},
    //   { name: 'json4', email: 'json4@gmail.com'},
    //   { name: 'json5', email: 'json5@gmail.com'},
    //   { name: 'json6', email: 'json6@gmail.com'},
    //   { name: 'json7', email: 'json7@gmail.com'}
    // ];
    const data = JSON.parse(event.body);
    console.log('data');
    console.log(data);
    const userList = data.userList;
    console.log(userList);
    const records = userList.map((user) => {
      // console.log("user: ", user);
      const partitionKey = uuid.v1();
      return {
        Data: JSON.stringify(user),
        PartitionKey: partitionKey,
      };
    });
    console.log('records: ', records);
    const params = {
      Records: records,
      StreamName: `handle-user-json-${config.stage}`
    };
    const res = await kinesis.putRecords(params).promise();
    return success(res);
    // putRecords().then((res) => {
    //   console.log("Done", res);
    //   return success();
    // }).catch((err) => {
    //   console.error("Error", err);
    // });
  } catch (e) {
    console.log(e);
    return failure(e.messsage);
  }
};
// function putRecords() {
//   const kinesis = new AWS.Kinesis();
//   const userList = [
//     { name: 'json1', email: 'json1@gmail.com'},
//     { name: 'json2', email: 'json2@gmail.com'},
//     { name: 'json3', email: 'json3@gmail.com'},
//     { name: 'json4', email: 'json4@gmail.com'},
//     { name: 'json5', email: 'json5@gmail.com'},
//     { name: 'json6', email: 'json6@gmail.com'},
//     { name: 'json7', email: 'json7@gmail.com'},
//   ];
//   const records = userList.map((user, i) => {
//     console.log("user: ", user);
//     const partitionKey = uuid.v1();
//     return {
//       Data: JSON.stringify(user),
//       PartitionKey: partitionKey,
//     };
//   });
//   console.log('records: ', records);
//   const params = {
//     Records: records,
//     StreamName: `handle-user-json-${config.stage}`
//   };
//   return kinesis.putRecords(params).promise();
// }
