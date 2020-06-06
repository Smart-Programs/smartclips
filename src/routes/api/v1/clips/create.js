import axios from 'axios'
import Account from '../../../../data/account'
import Auth from '../../../../data/auth'
import createClipMixer from '../../../../helpers/clips/mixer'

import { to, respond, internalError, logger } from '../../../../helpers'
import { createUserClip } from '../../../../helpers/validators'
import { compose } from 'compose-middleware'
import { DynamoDB } from 'aws-sdk'

const DocumentClient = new DynamoDB.DocumentClient({
  accessKeyId: process.env.DYNAMO_ACCESS_KEY,
  secretAccessKey: process.env.DYNAMO_ACCESS_SECRET,
  endpoint: process.env.DYNAMO_ENDPOINT,
  region: process.env.DYNAMO_REGION
})

export const get = compose([
  createUserClip.checks,
  createUserClip.validate,
  async (req, res) => {
    let {
      query: { token, platform, length = 30, type }
    } = req

    const [database_error, database_response] = await to(
      DocumentClient.query({
        TableName: process.env.DYNAMO_TABLE_NAME,
        IndexName: 'GSI2PK-GSI2SK-index',
        KeyConditionExpression: 'GSI2PK = :key and GSI2SK = :key',
        ExpressionAttributeValues: {
          ':key': `API#${token}`
        },
        Limit: 1
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

      if (type === 'text') {
        res.statusCode = 200
        return res.end(
          `Internal Server Error 1000: Could not complete the request. (Identifier ${req.request_id})`
        )
      } else {
        return internalError({
          res,
          req,
          code: '1000'
        })
      }
    }

    const { Items, Count, LastEvaluatedKey } = database_response

    if (Count === 0 || Items.length === 0) {
      logger.error({
        request_id: req.request_id,
        error: { code: '1200', class: 'dynamo' },
        request: {
          type: 'query',
          index: 'GSI2PK-GSI2SK-index',
          keys: { GSI2PK: `API#${token}`, GSI2SK: `API#${token}` }
        }
      })

      if (type === 'text') {
        res.statusCode = 200
        return res.end(`Bad Authorization: Token is invalid`)
      } else {
        return respond({
          res,
          req,
          errors: {
            message: 'Bad Authorization',
            list: [
              {
                msg: `Value is invalid`,
                param: 'token',
                location: 'query'
              }
            ]
          },
          status: 401
        })
      }
    }

    const Item = Account.toObject(Items[0], true)

    if (!Item.usage) {
      logger.error(
        {
          request_id: req.request_id,
          error: { code: '1100', class: 'dynamo' }
        },
        Item
      )

      if (type === 'text') {
        res.statusCode = 200
        return res.end(
          `Internal Server Error 1100: Could not complete the request. (Identifier ${req.request_id})`
        )
      } else {
        return internalError({
          req,
          res,
          code: '1100'
        })
      }
    }

    // TODO: Check subscriber status

    const [db_error, platformResponse] = await to(
      DocumentClient.query({
        TableName: process.env.DYNAMO_TABLE_NAME,
        IndexName: 'GSI1PK-GSI1SK-index',
        KeyConditionExpression: 'GSI1PK = :account AND GSI1SK = :platform',
        ExpressionAttributeValues: {
          ':account': `ACCOUNT#${Item.id}`,
          ':platform': `AUTH#${platform}`
        }
      }).promise()
    )

    if (db_error) {
      logger.error(
        {
          request_id: req.request_id,
          error: { code: '1000', class: 'dynamo' }
        },
        db_error
      )

      if (type === 'text') {
        res.statusCode = 200
        return res.end(
          `Internal Server Error 1000: Could not complete the request. (Identifier ${req.request_id})`
        )
      } else {
        return internalError({
          req,
          res,
          code: '1000'
        })
      }
    }

    if (
      !platformResponse ||
      !platformResponse.Items ||
      platformResponse.Items.length < 1
    ) {
      logger.error({
        request_id: req.request_id,
        error: { code: '1200', class: 'dynamo' },
        request: {
          type: 'query',
          index: 'GSI1PK-GSI1SK-index',
          keys: { GSI1PK: `ACCOUNT#${Item.id}`, GSI1SK: `AUTH#${platform}` }
        }
      })

      if (type === 'text') {
        res.statusCode = 200
        return res.end(
          `Bad Request: You do not have an account with the platform specified ${platform}`
        )
      } else {
        return respond({
          res,
          req,
          errors: {
            message: 'Bad Request',
            list: [
              {
                msg: `No account for specified value`,
                param: 'platform',
                location: 'query'
              }
            ]
          },
          status: 400
        })
      }
    }

    const platformAccount = Auth.toObject(platformResponse.Items[0])

    const {
      created,
      message,
      code,
      errors,
      status,
      clip
    } = await createClipMixer({
      account: Item,
      channelid: platformAccount.secondary,
      length,
      subscriber: true
    })

    if (!created || (errors && errors.length !== 0)) {
      logger.error(
        {
          request_id: req.request_id,
          error: { class: 'clip', code: code }
        },
        errors
      )

      if (type === 'text') {
        res.statusCode = 200
        return res.end(
          `${message}: ${errors[0].msg}. (Identifier ${code} -- ${req.request_id})`
        )
      } else {
        return respond({
          res,
          req,
          errors: {
            message: message,
            list: errors
          },
          status: status
        })
      }
    }

    // TODO: If subscriber create a shortened URL

    if (type === 'text') {
      res.statusCode = 200
      return res.end(`${message}`)
    } else {
      return respond({
        res,
        body: {
          Account: Account.toObject(Items[0]),
          Clip: clip,
          message
        },
        status: 200
      })
    }
  }
])
