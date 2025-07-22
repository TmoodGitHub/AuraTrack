// src/graphql/schema.ts
import { metricsTypeDefs } from './typeDefs/metrics';
import { authTypeDefs } from './typeDefs/user';
import { auditTypeDefs } from './typeDefs/audit';

export const typeDefs = [metricsTypeDefs, authTypeDefs, auditTypeDefs];
