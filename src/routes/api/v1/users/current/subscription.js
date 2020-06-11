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
  currentUserAuth.validateAndSet,
  async (req, res) => {
    const account = req.current

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
