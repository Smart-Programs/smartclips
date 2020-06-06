import Clip from '../../../../../../data/clip'

import { respond, to, internalError, logger } from '../../../../../../helpers'
import { getUserClip } from '../../../../../../helpers/validators'
import { compose } from 'compose-middleware'
import { DynamoDB } from 'aws-sdk'

const DocumentClient = new DynamoDB.DocumentClient({
  accessKeyId: process.env.DYNAMO_ACCESS_KEY,
  secretAccessKey: process.env.DYNAMO_ACCESS_SECRET,
  endpoint: process.env.DYNAMO_ENDPOINT,
  region: process.env.DYNAMO_REGION
})

export const get = compose([
  getUserClip.checks,
  getUserClip.validate,
  async (req, res) => {
    const {
      params: { userid, clipid }
    } = req

    const [database_error, database_response] = await to(
      DocumentClient.get({
        TableName: process.env.DYNAMO_TABLE_NAME,
        Key: {
          PK: `ACCOUNT#${userid}`,
          SK: `#CLIP#${clipid}`
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
        code: '1000',
        status: 500
      })
    }

    const { Item } = database_response

    if (!Item) {
      logger.error({
        request_id: req.request_id,
        error: { code: '1200', class: 'dynamo' },
        request: {
          type: 'get',
          keys: { PK: `ACCOUNT#${userid}`, SK: `#CLIP#${clipid}` }
        }
      })

      return respond({
        res,
        req,
        errors: {
          message: 'Not Found',
          list: [
            {
              msg: `Clip resource not found`,
              location: 'param',
              param: 'clipid',
              value: clipid,
              code: '1200'
            }
          ]
        },
        status: 404
      })
    }

    const formattedItem = Clip.toObject(Item, false)

    return respond({
      res,
      body: formattedItem
    })
  }
])
