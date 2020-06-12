import { DynamoDB } from 'aws-sdk'

import config from '../config'

const DocumentClient = new DynamoDB.DocumentClient({
  accessKeyId: process.env.DYNAMO_ACCESS_KEY,
  secretAccessKey: process.env.DYNAMO_ACCESS_SECRET,
  endpoint: config.DYNAMO_ENDPOINT,
  region: config.DYNAMO_REGION,
  httpOptions: {
    timeout: 5000
  },
  maxRetries: 3
})

export default DocumentClient
