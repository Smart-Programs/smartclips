import Account from '../../../../../data/account'

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

    const [database_error, database_response] = await to(
      DocumentClient.get({
        TableName: process.env.DYNAMO_TABLE_NAME,
        Key: {
          PK: `ACCOUNT#${current.account}`,
          SK: `ACCOUNT#${current.account}`
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

    const { Item } = database_response

    if (!Item) {
      logger.error({
        request_id: req.request_id,
        error: { code: '1200', class: 'dynamo' },
        request: {
          type: 'get',
          keys: {
            PK: `ACCOUNT#${current.account}`,
            SK: `ACCOUNT#${current.account}`
          }
        }
      })

      return respond({
        res,
        req,
        errors: {
          message: 'Not Found',
          list: [
            {
              msg: `Invalid account`,
              location: 'internal-1200'
            }
          ]
        },
        status: 404
      })
    }

    const formattedItem = Account.toObject(Item, true)

    return respond({
      res,
      req,
      body: formattedItem,
      status: 200
    })
  }
])
