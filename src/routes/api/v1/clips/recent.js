import axios from 'axios'

import { Clip, Account } from '../../../../data'
import { ulid, decodeTime } from 'ulid'
import { compose } from 'compose-middleware'
import { getRecentClips } from '../../../../helpers/validators'
import {
  isULID,
  getPastULID,
  getFutureULID,
  respond,
  to,
  internalError,
  logger
} from '../../../../helpers'

export const get = compose([
  getRecentClips.checks,
  getRecentClips.validate,
  async (req, res) => {
    const {
      query: { next, previous, limit }
    } = req

    const [database_error, database_response] = await to(
      Clip.queryRecentClips({
        start: { next, previous },
        Limit: limit,
        maxPages: 4
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

      return internalError({ req, res, code: '1000' })
    }

    const { Items, time } = database_response

    const assumedLastPage = getPastULID(Date.now() - 1000 * 60 * 60 * 24 * 60)
    const passedLastPage = decodeTime(assumedLastPage) >= time

    const extras = {
      assumedLast: {
        page: assumedLastPage,
        passed: passedLastPage
      }
    }

    if (Items.length === 0) {
      const Page = {
        next: getPastULID(time),
        previous: getFutureULID(time),
        note:
          'Next and previous may have a value even if there are no more clips past the page you are on. Each section of pages are split by clips for a 9 hour period.'
      }

      return respond({
        req,
        res,
        body: {
          Items,
          Page,
          extras
        },
        status: 200
      })
    }

    const accountIds = Items.map(({ account }) => ({
      PK: `ACCOUNT#${account}`,
      SK: `ACCOUNT#${account}`
    })).filter(
      ({ PK }, index, a) => a.findIndex(({ SK }) => PK === SK) === index
    )

    const [db_error, accounts] = await to(Account.getAllByID({ accountIds }))

    if (db_error) {
      logger.error(
        {
          request_id: req.request_id,
          error: { code: '1000', class: 'dynamo' }
        },
        db_error
      )

      return internalError({ req, res, code: '1000' })
    }

    const ClipItems = Items.map((Item, index) => {
      return {
        ...Item,
        User: accounts.Items.find(i => i.id === Item.account)
      }
    })

    const Page = {
      next: ClipItems[ClipItems.length - 1].id,
      previous: ClipItems[0].id,
      note:
        'Next and previous may have a value even if there are no more clips past the page you are on. Each section of pages are split by clips for a 9 hour period.'
    }

    return respond({
      res,
      req,
      body: {
        Items: ClipItems,
        Page,
        extras
      },
      status: 200
    })
  }
])
