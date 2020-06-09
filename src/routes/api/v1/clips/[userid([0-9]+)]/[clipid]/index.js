import { Clip } from '../../../../../../data'
import { respond, to, internalError, logger } from '../../../../../../helpers'
import { getUserClip } from '../../../../../../helpers/validators'
import { compose } from 'compose-middleware'

export const get = compose([
  getUserClip.checks,
  getUserClip.validate,
  async (req, res) => {
    const {
      params: { userid, clipid }
    } = req

    const [database_error, database_response] = await to(
      Clip.getClipByID({ accountId: userid, clipId: clipid })
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
        code: '1000',
        status: 500
      })
    }

    const { Item } = database_response

    if (!Item) {
      logger.error({
        request_id: req.request_id,
        error: { code: '1200', class: 'dynamo' },
        request: {
          type: 'get',
          keys: { PK: `ACCOUNT#${userid}`, SK: `#CLIP#${clipid}` }
        }
      })

      return respond({
        res,
        req,
        errors: {
          message: 'Not Found',
          list: [
            {
              msg: `Clip resource not found`,
              location: 'param',
              param: 'clipid',
              value: clipid,
              code: '1200'
            }
          ]
        },
        status: 404
      })
    }

    return respond({
      res,
      body: Item
    })
  }
])
