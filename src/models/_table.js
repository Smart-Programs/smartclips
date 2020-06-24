import { DynamoDB } from 'aws-sdk'
import { Table } from 'dynamodb-toolbox'

import config from '../config'

const DocumentClient = new DynamoDB.DocumentClient({
  accessKeyId: config.dynamo.accessKeyId,
  secretAccessKey: config.dynamo.secretAccessKey,
  endpoint: config.dynamo.endpoint,
  region: config.dynamo.region,
  httpOptions: {
    timeout: 5000
  },
  maxRetries: 3
})

const table = new Table({
  name: config.dynamo.TableName,

  partitionKey: 'PK',
  sortKey: 'SK',
  entityField: 'entity',

  indexes: {
    ['GSI1PK-GSI1SK-index']: { partitionKey: 'GSI1PK', sortKey: 'GSI1SK' },
    ['GSI2PK-GSI2SK-index']: { partitionKey: 'GSI2PK', sortKey: 'GSI2SK' },
    ['GSI3PK-GSI3SK-index']: { partitionKey: 'GSI3PK', sortKey: 'GSI3SK' },
    ['GSI4PK-GSI4SK-index']: { partitionKey: 'GSI4PK', sortKey: 'GSI4SK' },
    ['GSI5PK-GSI5SK-index']: { partitionKey: 'GSI5PK', sortKey: 'GSI5SK' }
  },

  DocumentClient
})

export default table
