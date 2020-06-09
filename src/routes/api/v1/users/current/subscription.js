import { Account } from '../../../../../data'

import {
  getSubscription,
  getToken,
  respond,
  to,
  internalError,
  logger
} from '../../../../../helpers'
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
    } else if (database_response.Item) {
      logger.error({
        request_id: req.request_id,
        error: { code: '1100', class: 'dynamo' },
        query: { type: 'Account.getByID', id: current.account }
      })

      return internalError({
        res,
        req,
        code: '1100'
      })
    }

    const { Item: account } = database_response

    const [braintree_error, braintree_responses] = await to(
      Promise.all([
        getToken(account.braintreeId),
        getSubscription(account.braintreeId)
      ])
    )

    if (braintree_error || braintree_responses[0].success !== true) {
      return internalError({
        res,
        req,
        code: '2000'
      })
    } else {
      const [data, subscription] = braintree_responses
      return respond({
        res,
        req,
        body: {
          ...subscription,
          token: data.clientToken
        }
      })
    }
  }
])
