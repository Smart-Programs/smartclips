import axios from 'axios'

import createClipMixer from '../../../../helpers/clips/mixer'

import { Account, Auth } from '../../../../data'
import { to, respond, internalError, logger } from '../../../../helpers'
import { createUserClip } from '../../../../helpers/validators'
import { compose } from 'compose-middleware'

export const get = compose([
  createUserClip.checks,
  createUserClip.validate,
  async (req, res) => {
    let {
      query: { token, platform, length = 30, type }
    } = req

    const [database_error, database_responses] = await to(
      Promise.all([
        Account.getByAPIKey({ apiKey: token, includePrivates: true }),
        Auth.getAuthProviders({
          accountId: token.split('-')[0],
          provider: platform
        })
      ])
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

    const [database_response, platformResponse] = database_responses

    const { Item } = database_response

    if (!Item) {
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
    } else if (
      !platformResponse ||
      !platformResponse.Items ||
      platformResponse.Items.length !== 1
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

    const platformAccount = platformResponse.Items[0]

    // TODO: Check subscriber status

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
          Account: Item,
          Clip: clip,
          message
        },
        status: 200
      })
    }
  }
])
