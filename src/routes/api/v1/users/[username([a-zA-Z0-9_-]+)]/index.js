import Account from '../../../../../data/account'

import { respond, to, internalError, logger } from '../../../../../helpers'
import { getUserByUsername } from '../../../../../helpers/validators'
import { compose } from 'compose-middleware'
import { DynamoDB } from 'aws-sdk'

const DocumentClient = new DynamoDB.DocumentClient({
  accessKeyId: process.env.DYNAMO_ACCESS_KEY,
  secretAccessKey: process.env.DYNAMO_ACCESS_SECRET,
  endpoint: process.env.DYNAMO_ENDPOINT,
  region: process.env.DYNAMO_REGION
})

export const get = compose([
  getUserByUsername.checks,
  getUserByUsername.validate,
  async (req, res) => {
    const {
      params: { username },
      query: { hash, next, previous }
    } = req

    const [database_error, database_response] = await to(
      DocumentClient.query({
        TableName: process.env.DYNAMO_TABLE_NAME,
        IndexName: 'GSI1PK-GSI1SK-index',
        KeyConditionExpression:
          'GSI1PK = :username and begins_with(GSI1SK, :usernameWithHash)',
        ExpressionAttributeValues: {
          ':username': `USER#${username.toUpperCase()}`,
          ':usernameWithHash': `USER#${username.toUpperCase()}#${hash}`
        }
      }).promise()
    )

    if (database_error) {
      logger.error(
        {
          request_id: req.request_id,
          error: { code: '1000', class: 'dynamo' }
        },
        database_error
      )

      return internalError({
        res,
        req,
        code: '1000'
      })
    }

    const { Items, Count, LastEvaluatedKey } = database_response

    const formattedItems = Items.map(Item => Account.toObject(Item))

    return respond({
      res,
      req,
      body: {
        Items: formattedItems,
        Page: {
          next:
            formattedItems.length === 0 || LastEvaluatedKey === undefined
              ? null
              : formattedItems[formattedItems.length - 1].id,
          previous:
            formattedItems.length === 0 || !next ? null : formattedItems[0].id
        }
      },
      status: 200
    })
  }
])
