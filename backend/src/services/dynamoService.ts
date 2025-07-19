import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const isLocal = process.env.DYNAMO_LOCAL === 'true';

if (isLocal) {
  process.env.AWS_ACCESS_KEY_ID = 'dummy';
  process.env.AWS_SECRET_ACCESS_KEY = 'dummy';
}

const clientConfig: DynamoDBClientConfig = {
  region: 'us-east-1',
};

if (isLocal) {
  clientConfig.endpoint = 'http://localhost:8000';
  clientConfig.credentials = {
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy',
  };
}

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient(clientConfig));

const TABLE_NAME = 'metrics';

export const createMetric = async (input: {
  userId: string;
  timestamp: string;
  mood: number;
  energy: number;
  sleepHours: number;
}) => {
  const metricWidthId = {
    id: uuidv4(),
    ...input,
  };

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: metricWidthId,
  });

  await ddb.send(command);
  return metricWidthId;
};

export const getMetrics = async (userId: string) => {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'userId = :uid',
    ExpressionAttributeValues: {
      ':uid': userId,
    },
    ScanIndexForward: false,
  });

  const result = await ddb.send(command);
  return result.Items || [];
};
