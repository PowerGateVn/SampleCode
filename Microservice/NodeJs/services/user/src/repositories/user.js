import * as dynamoDbLib from '../../../../libs/dynamodb-lib';

export async function create(user) {
  try {
    const params = {
      TableName: process.env.tableName,
      Item: user,
    };
    await dynamoDbLib.call('put', params);
    return params.Item;
  } catch (e) {
    throw e;
  }
}
