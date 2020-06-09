import { Account, Auth } from '../../../../../data'

import { respond, to, internalError, logger } from '../../../../../helpers'
import { getUserById } from '../../../../../helpers/validators'
import { compose } from 'compose-middleware'

export const get = compose([
  getUserById.checks,
  getUserById.validate,
  async (req, res) => {
    const {
      params: { userid },
      query: { includeSocials }
    } = req

    let promises = [Account.getByID({ accountId: userid })]

    promises.push(Auth.getAuthProviders({ accountId: userid }))

    const [database_error, database_results] = await to(Promise.all(promises))

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

    const [{ Item: User }] = database_results

    if (!User) {
      logger.error({
        request_id: req.request_id,
        error: { code: '1200', class: 'dynamo' },
        request: {
          type: 'get',
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

    const body = {
      User
    }

    if (includeSocials) {
      const { Items: Socials } = database_results[1]

      body.Socials = Socials
    }

    return respond({
      res,
      body
    })
  }
])
