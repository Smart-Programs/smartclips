import { Auth } from '../../../../../data'

import { respond, to, internalError, logger } from '../../../../../helpers'
import { currentUserAuth } from '../../../../../helpers/validators'
import { compose } from 'compose-middleware'

export const get = compose([
  currentUserAuth.validate,
  async (req, res) => {
    const current = req.session.user

    const {
      query: { next, previous }
    } = req

    const [database_error, database_response] = await to(
      Auth.getAuthProviders({
        accountId: current.account,
        includeTokens: false
      })
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

    const { Items } = database_response

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

    return respond({
      res,
      req,
      body: database_response,
      status: 200
    })
  }
])
