import axios from 'axios'
import { Auth, Clip } from '../../../../../data'

import { decodeTime } from 'ulid'
import {
  isULID,
  getFutureULID,
  to,
  respond,
  internalError,
  logger
} from '../../../../../helpers'
import { compose } from 'compose-middleware'
import { getUserClips } from '../../../../../helpers/validators'
import { DynamoDB } from 'aws-sdk'

const DocumentClient = new DynamoDB.DocumentClient({
  accessKeyId: process.env.DYNAMO_ACCESS_KEY,
  secretAccessKey: process.env.DYNAMO_ACCESS_SECRET,
  endpoint: process.env.DYNAMO_ENDPOINT,
  region: process.env.DYNAMO_REGION
})

export const get = compose([
  getUserClips.checks,
  getUserClips.validate,
  async (req, res) => {
    const {
      params: { userid },
      query: { next, previous, includeSocials }
    } = req

    const time = next || previous ? decodeTime(next || previous) : Date.now()

    const promises = [
      Clip.queryUserClips({ accountId: userid, next, previous })
    ]

    if (includeSocials) {
      promises.push(Auth.getAuthProviders({ accountId: userid }))
    }

    const [database_error, database_response] = await to(Promise.all(promises))

    if (database_error) {
      logger.error(
        {
          request_id: req.request_id,
          error: { code: '1000', class: 'dynamo' }
        },
        database_error
      )

      console.log({ database_error })

      return internalError({
        res,
        req,
        code: '1000'
      })
    }

    const [{ Items }] = database_response

    if (Items.length === 0 && !(next || previous)) {
      logger.error({
        request_id: req.request_id,
        error: { code: '1200', class: 'dynamo' },
        request: {
          type: 'query - SK range <=',
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

    if (includeSocials) {
      Items.push({
        type: 'Socials',
        Items: database_response[1].Items
      })
    }

    return respond({
      req,
      res,
      body: {
        Items,
        Page: {
          next: Items.length === 0 ? null : Items[Items.length - 1].id,
          previous: Items.length === 0 ? getFutureULID(time) : Items[0].id,
          note:
            'Previous may have a value even if there are no more clips past the page you are on.'
        }
      },
      status: 200
    })
  }
])
