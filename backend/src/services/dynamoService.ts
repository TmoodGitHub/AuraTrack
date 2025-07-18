export const DynamoService = {
  getMetrics: async () => {
    console.log('Fetching metrics from DynamoDB (stub)');
    return [];
  },

  createMetric: async (data: any) => {
    console.log('Creating metric in DynamoDB (stub):', data);
    return { id: Date.now().toString(), ...data };
  },
};
