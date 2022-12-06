import { isEmpty, has } from "lodash";
import DynamoDB, { DocumentClient } from "aws-sdk/clients/dynamodb";
import DynamoDBConnection from "./connection";

const DEFAULT_LIMIT = 10;

export default class DynamodbHelper {
  public tableName: string;
  public client: DynamoDB.DocumentClient;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.client = DynamoDBConnection.Client();
  }

  public async insertOrReplace<T>(item: T): Promise<T> {
    const params: DocumentClient.PutItemInput = {
      TableName: this.tableName,
      Item: item,
    };

    await this.client.put(params).promise();
    return item;
  }

  public async findById<T>(key: any): Promise<T | null> {
    const params = {
      Key: key,
      TableName: this.tableName,
    };

    const result = await this.client.get(params).promise();

    if (isEmpty(result)) {
      return null;
    } else {
      return <T>result.Item;
    }
  }

  public async getWhereIdIn<T>(keys: any[]): Promise<T[]> {
    const params = { RequestItems: {} };
    params.RequestItems[this.tableName] = { Keys: keys };

    try {
      const result = await this.client.batchGet(params).promise();
      if (result.Responses) {
        const items = result.Responses[this.tableName];
        if (isEmpty(items)) {
          return [];
        }
        return <T[]>items;
      } else {
        return [];
      }
    } catch (err) {
      return [];
    }
  }

  public async list<T>(
    limit?: number,
    keyName?: string,
    nextToken?: any
  ): Promise<{
    nextToken: string;
    items: T[];
  }> {
    if (!limit) {
      limit = DEFAULT_LIMIT;
    }

    const params: DocumentClient.ScanInput = {
      Limit: limit,
      TableName: this.tableName,
    };
    if (nextToken && keyName) {
      params.ExclusiveStartKey = { [keyName]: nextToken };
    }

    const result = await this.client.scan(params).promise();

    let newNextToken = null;
    if (has(result, "LastEvaluatedKey") && keyName && result.LastEvaluatedKey) {
      newNextToken = result.LastEvaluatedKey[keyName];
    }

    return {
      nextToken: newNextToken,
      items: <T[]>result.Items,
    };
  }

  public async query<T>(indexName: string, hashIndexOpts: any): Promise<T[]> {
    const { attrName, attrValue, operator } = hashIndexOpts;

    const params: DocumentClient.QueryInput = {
      TableName: this.tableName,
      IndexName: indexName,
      KeyConditionExpression: `${attrName} ${operator} :hkey`,
      ExpressionAttributeValues: {
        ":hkey": attrValue,
      },
    };

    const result = await this.client.query(params).promise();

    return <T[]>result.Items;
  }

  public async updateById(key: any, data: any): Promise<void> {
    const updateExpressions = [];
    const expressionsValues = {};
    const expressionAttributeNames = {};
    for (const fieldName of Object.keys(data)) {
      const fieldValue = data[fieldName];
      updateExpressions.push(`#${fieldName} = :${fieldName}`);
      expressionsValues[`:${fieldName}`] = fieldValue;
      expressionAttributeNames[`#${fieldName}`] = fieldName;
    }
    const updateExpression = "set " + updateExpressions.join(", ");

    const params: DocumentClient.UpdateItemInput = {
      TableName: this.tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionsValues,
      ExpressionAttributeNames: expressionAttributeNames,
    };

    await this.client.update(params).promise();
  }

  public async deleteById(key: any): Promise<void> {
    const params: DocumentClient.DeleteItemInput = {
      Key: key,
      TableName: this.tableName,
    };
    await this.client.delete(params).promise();
  }
}
