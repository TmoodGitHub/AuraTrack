import { mergeTypeDefs } from '@graphql-tools/merge';

import { baseTypeDefs } from './typeDefs/baseTypeDefs';
import { metricsTypeDefs } from './typeDefs/metrics';
import { authTypeDefs } from './typeDefs/auth';
import { auditTypeDefs } from './typeDefs/audit';

export const typeDefs = mergeTypeDefs([
  baseTypeDefs,
  metricsTypeDefs,
  authTypeDefs,
  auditTypeDefs,
]);
