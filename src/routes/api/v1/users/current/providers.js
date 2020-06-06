import Auth from '../../../../../data/auth'

import { respond, to, internalError, logger } from '../../../../../helpers'
import { currentUserAuth } from '../../../../../helpers/validators'
import { compose } from 'compose-middleware'
import { DynamoDB } from 'aws-sdk'

const DocumentClient = new DynamoDB.DocumentClient({
  accessKeyId: process.env.DYNAMO_ACCESS_KEY,
  secretAccessKey: process.env.DYNAMO_ACCESS_SECRET,
  endpoint: process.env.DYNAMO_ENDPOINT,
  region: process.env.DYNAMO_REGION
})

export const get = compose([
  currentUserAuth.validate,
  async (req, res) => {
    const current = req.session.user

    const {
      query: { next, previous }
    } = req

    const [database_error, database_response] = await to(
      DocumentClient.query({
        TableName: process.env.DYNAMO_TABLE_NAME,
        IndexName: 'GSI1PK-GSI1SK-index',
        KeyConditionExpression: 'GSI1PK = :account',
        ExpressionAttributeValues: {
          ':account': `ACCOUNT#${current.account}`
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

    if (!Items || !Items.length) {
      logger.error(
        {
          request_id: req.request_id,
          error: { code: '1200', class: 'dynamo' }
        },
        database_error
      )

      return respond({
        res,
        req,
        errors: {
          message: 'Not Found',
          list: [
            {
              msg: `Invalid account`,
              location: 'internal',
              code: '1200'
            }
          ]
        },
        status: 404
      })
    }

    const formattedItems = Items.map(Item => Auth.toObject(Item))

    return respond({
      res,
      req,
      body: { Items: formattedItems, Count, LastEvaluatedKey },
      status: 200
    })
  }
])
