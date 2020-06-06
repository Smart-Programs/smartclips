import Account from '../../../../../data/account'
import Auth from '../../../../../data/auth'

import { respond, to, internalError, logger } from '../../../../../helpers'
import { getUserById } from '../../../../../helpers/validators'
import { compose } from 'compose-middleware'
import { DynamoDB } from 'aws-sdk'

const DocumentClient = new DynamoDB.DocumentClient({
  accessKeyId: process.env.DYNAMO_ACCESS_KEY,
  secretAccessKey: process.env.DYNAMO_ACCESS_SECRET,
  endpoint: process.env.DYNAMO_ENDPOINT,
  region: process.env.DYNAMO_REGION
})

export const get = compose([
  getUserById.checks,
  getUserById.validate,
  async (req, res) => {
    const {
      params: { userid },
      query: { includeSocials }
    } = req

    let promises = [
      DocumentClient.get({
        TableName: process.env.DYNAMO_TABLE_NAME,
        Key: {
          PK: `ACCOUNT#${userid}`,
          SK: `ACCOUNT#${userid}`
        }
      }).promise()
    ]

    promises.push(
      DocumentClient.query({
        TableName: process.env.DYNAMO_TABLE_NAME,
        IndexName: 'GSI1PK-GSI1SK-index',
        KeyConditionExpression: 'GSI1PK = :account',
        ExpressionAttributeValues: {
          ':account': `ACCOUNT#${userid}`
        }
      }).promise()
    )

    const [database_error, database_results] = await to(Promise.all(promises))

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

    const [{ Item: User }] = database_results

    if (!User) {
      logger.error({
        request_id: req.request_id,
        error: { code: '1200', class: 'dynamo' },
        request: {
          type: 'get',
          keys: { PK: `ACCOUNT#${userid}`, SK: `ACCOUNT#${userid}` }
        }
      })

      return respond({
        res,
        req,
        errors: {
          message: 'Not Found',
          list: [
            {
              value: userid,
              msg: 'Not found',
              param: 'userid',
              location: 'params',
              code: '1200'
            }
          ]
        },
        status: 404
      })
    }

    const body = {
      User: Account.toObject(User)
    }

    if (includeSocials) {
      const { Items: Socials } = database_results[1]

      body.Socials = Socials.map(social => Auth.toObject(social))
    }

    return respond({
      res,
      body
    })
  }
])
