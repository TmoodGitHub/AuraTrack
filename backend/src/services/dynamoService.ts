// src/services/dynamoService.ts

// 1. Load .env first, so DYNAMO_LOCAL, AWS_* etc are set
import dotenv from 'dotenv';
dotenv.config();

import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const isLocal = process.env.DYNAMO_LOCAL === 'true';

// If running locally, set dummy creds (DynamoDB Local ignores them)
if (isLocal) {
  process.env.AWS_ACCESS_KEY_ID = 'dummy';
  process.env.AWS_SECRET_ACCESS_KEY = 'dummy';
}

const clientConfig: DynamoDBClientConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
};

// Point at your local endpoint if in local mode
if (isLocal) {
  clientConfig.endpoint =
    process.env.DYNAMO_ENDPOINT || 'http://localhost:8000';
  clientConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  };
}

const ddbClient = new DynamoDBClient(clientConfig);
export const ddb = DynamoDBDocumentClient.from(ddbClient);

// Use the same table name you’ve configured
const TABLE_NAME = process.env.DYNAMO_TABLE_NAME || 'metrics';

/**
 * Persist a metric in DynamoDB
 */
export async function createMetric(item: {
  id: string;
  userId: string;
  timestamp: string;
  mood: number;
  energy: number;
  sleepHours: number;
}) {
  await ddb.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    })
  );
  return item;
}

/**
 * Query metrics for one user
 */
export async function getMetrics(userId: string) {
  const result = await ddb.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'userId = :uid',
      ExpressionAttributeValues: { ':uid': userId },
      ScanIndexForward: false,
    })
  );
  return result.Items || [];
}
