import { Account } from '../../../../../data'

import { respond, to, internalError, logger } from '../../../../../helpers'
import { getUserByUsername } from '../../../../../helpers/validators'
import { compose } from 'compose-middleware'

export const get = compose([
  getUserByUsername.checks,
  getUserByUsername.validate,
  async (req, res) => {
    const {
      params: { username },
      query: { hash, next, previous }
    } = req

    const [database_error, database_response] = await to(
      Account.queryByUsernameAndHash({ username, hash })
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

    const { Items, LastEvaluatedKey } = database_response

    return respond({
      res,
      req,
      body: {
        Items,
        Page: {
          next:
            Items.length === 0 || LastEvaluatedKey === undefined
              ? null
              : Items[Items.length - 1].id,
          previous: Items.length === 0 || !next ? null : Items[0].id
        }
      },
      status: 200
    })
  }
])
