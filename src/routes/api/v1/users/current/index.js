import { Account } from '../../../../../data'

import { respond, to, internalError, logger } from '../../../../../helpers'
import { currentUserAuth } from '../../../../../helpers/validators'
import { compose } from 'compose-middleware'

export const get = compose([
  currentUserAuth.validate,
  async (req, res) => {
    const current = req.session.user

    const [database_error, database_response] = await to(
      Account.getByID({ accountId: current.account, includePrivates: true })
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
    } else if (!database_response.Item) {
      logger.error({
        request_id: req.request_id,
        error: { code: '1100', class: 'dynamo' },
        query: { type: 'Account.getByID', id: current.account }
      })

      console.log({ database_response })

      return internalError({
        res,
        req,
        code: '1100'
      })
    }

    const { Item: account } = database_response

    return respond({
      res,
      req,
      body: account,
      status: 200
    })
  }
])
