import axios from 'axios'
import Clip from '../../../../data/clip'
import Account from '../../../../data/account'

import { ulid, decodeTime } from 'ulid'
import { compose } from 'compose-middleware'
import { getRecentClips } from '../../../../helpers/validators'
import { DynamoDB } from 'aws-sdk'

import {
  isULID,
  getPastULID,
  getFutureULID,
  respond,
  to,
  internalError,
  logger
} from '../../../../helpers'

const DocumentClient = new DynamoDB.DocumentClient({
  accessKeyId: process.env.DYNAMO_ACCESS_KEY,
  secretAccessKey: process.env.DYNAMO_ACCESS_SECRET,
  endpoint: process.env.DYNAMO_ENDPOINT,
  region: process.env.DYNAMO_REGION
})

const getClips = (
  start = { next: null, previous: null },
  { maxItems = 30, maxPages = 3 } = {}
) => {
  let items = []
  const loop = async ({ next, previous, page = 1 }) => {
    const time = next || previous ? decodeTime(next || previous) : Date.now()

    const ExpressionAttributeValues = {
      ':recent': `RC#${ulid(time).substring(0, 4)}`
    }

    if (next || previous) ExpressionAttributeValues[':range'] = next || previous

    const [database_error, database_response] = await to(
      DocumentClient.query({
        TableName: process.env.DYNAMO_TABLE_NAME,
        IndexName: 'GSI2PK-GSI2SK-index',
        KeyConditionExpression: `GSI2PK = :recent${
          next ? ' and GSI2SK < :range' : previous ? ' and GSI2SK > :range' : ''
        }`,
        ExpressionAttributeValues: ExpressionAttributeValues,
        ScanIndexForward: false,
        Limit: maxItems
      }).promise()
    )

    if (database_error) return Promise.reject(database_error)

    const { Items } = database_response
    if (previous) items = [...Items, ...items]
    else items = [...items, ...Items]

    if (items.length >= maxItems || page >= maxPages)
      return Promise.resolve({ Items: items, time })

    const pages = {
      next: previous
        ? null
        : Items.length === 0
        ? getPastULID(time)
        : Items[Items.length - 1].SK.replace('#CLIP#', ''),
      previous: !previous
        ? null
        : Items.length === 0
        ? getFutureULID(time)
        : Items[0].SK.replace('#CLIP#', ''),
      page: ++page
    }

    if (!next && !previous) return Promise.resolve({ Items: items, time })

    return loop(pages)
  }

  return loop(start)
}

export const get = compose([
  getRecentClips.checks,
  getRecentClips.validate,
  async (req, res) => {
    const {
      query: { next, previous, limit }
    } = req

    const [database_error, database_response] = await to(
      getClips({ next, previous }, { maxItems: limit })
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

    const accountIds = Items.map(item => ({
      PK: item.PK,
      SK: item.PK
    })).filter(
      (item, index) => Items.findIndex(i => i.PK === item.PK) === index
    )

    const [db_error, getAccountIds] = await to(
      DocumentClient.batchGet({
        RequestItems: {
          [process.env.DYNAMO_TABLE_NAME]: {
            Keys: accountIds
          }
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

      return internalError({ req, res, code: '1000' })
    }

    if (
      !getAccountIds ||
      !getAccountIds.Responses ||
      !getAccountIds.Responses[process.env.DYNAMO_TABLE_NAME]
    ) {
      logger.error({
        request_id: req.request_id,
        error: { code: '1100', class: 'dynamo' },
        request: {
          type: 'batchGet',
          keys: accountIds
        }
      })

      return internalError({ req, res, code: '1100' })
    }

    const ClipItems = Items.map((Item, index) => {
      return {
        ...Clip.toObject(Item),
        type: 'Clip',
        User: Account.toObject(
          getAccountIds.Responses[process.env.DYNAMO_TABLE_NAME].find(
            i => i.PK === Item.PK
          )
        )
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
