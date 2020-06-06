import axios from 'axios'
import Account from '../../../../../data/account'
import Auth from '../../../../../data/auth'
import Clip from '../../../../../data/clip'

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
      DocumentClient.query({
        TableName: process.env.DYNAMO_TABLE_NAME,
        KeyConditionExpression: `PK = :account and SK ${
          next ? '<' : previous ? '>' : '<='
        } :range`,
        ExpressionAttributeValues: {
          ':account': `ACCOUNT#${userid}`,
          ':range':
            next || previous ? `#CLIP#${next || previous}` : `ACCOUNT#${userid}`
        },
        ScanIndexForward: false,
        Limit: 30
      }).promise()
    ]

    if (includeSocials) {
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

    const accountIndex = Items.findIndex(
      I => I.GSI1PK && I.GSI1PK.startsWith('USER#')
    )

    const ClipItems = Items.map((Item, index) => {
      if (index !== accountIndex)
        return {
          ...Clip.toObject(Item),
          type: 'Clip'
        }
      else
        return {
          ...Account.toObject(Item, false),
          type: 'Account'
        }
    })

    if (includeSocials) {
      ClipItems.push({
        type: 'Socials',
        Items: database_response[1].Items.map(item => Auth.toObject(item))
      })
    }

    return respond({
      req,
      res,
      body: {
        Items: ClipItems,
        Page: {
          next:
            ClipItems.length === 0 ? null : ClipItems[ClipItems.length - 1].id,
          previous:
            ClipItems.length === 0 ? getFutureULID(time) : ClipItems[0].id,
          note:
            'Previous may have a value even if there are no more clips past the page you are on.'
        }
      },
      status: 200
    })
  }
])
