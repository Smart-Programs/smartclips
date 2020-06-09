import DocumentClient from './DocumentClient'

import Account from './account'

import { ulid as generateId, decodeTime as getCreated } from 'ulid'
import { to, getFutureULID, getPastULID } from '../helpers'

const STATUSES = {
  WORKING: 0,
  SUCCESS: 1,
  ERROR: 2
}

export default class Clip {
  constructor (
    {
      id,
      account,
      views = 0,
      likes = 0,
      comments = 0,
      game = 0,
      title = 'No Clip Title',
      status = STATUSES.WORKING,
      platform = 'MIXER',
      createdAt = new Date()
    },
    isSub = false
  ) {
    if (!account) throw new Error('Clip must have an account.')

    if (id) this.id = id
    else this.id = generateId(createdAt.getTime())

    this.account = account

    this.views = views
    this.likes = likes
    this.comments = comments

    this.status = status
    this.title = title
    this.game = game
    this.platform = platform.toUpperCase()

    this.isSub = isSub
  }

  key () {
    return {
      PK: `ACCOUNT#${this.account}`,
      SK: `#CLIP#${this.id}`
    }
  }

  gsi1Key () {
    if (this.isSub)
      return {
        GSI1PK: `RC#GAME#${this.game}#${this.id.substring(0, 4)}`,
        GSI1SK: `${this.id}`
      }
    else return {}
  }

  gsi2Key () {
    if (this.isSub)
      return {
        GSI2PK: `RC#${this.id.substring(0, 4)}`,
        GSI2SK: `${this.id}`
      }
    else return {}
  }

  gsi3Key () {
    if (this.isSub)
      return {
        GSI3PK: `PC#GAME#${this.game}`,
        GSI3SK: generateId(this.likes * 1.3 + this.views)
      }
    else return {}
  }

  gsi4Key () {
    if (this.isSub)
      return {
        GSI4PK: `PC`,
        GSI4SK: generateId(this.likes * 1.3 + this.views)
      }
    else return {}
  }

  statsKey () {
    if (this.isSub)
      return {
        stats: {
          views: this.views,
          likes: this.likes,
          comments: this.comments
        }
      }
    else
      return {
        stats: {
          comments: this.comments
        }
      }
  }

  toItem () {
    return {
      ...this.key(),
      ...this.gsi1Key(),
      ...this.gsi2Key(),
      ...this.gsi3Key(),
      ...this.gsi4Key(),
      ...this.statsKey(),
      data: {
        title: this.title,
        game: this.game,
        status: this.status,
        platform: this.platform
      }
    }
  }

  static toObject (Item) {
    if (!Item || !Item.data) return {}

    const item = {
      id: Item.SK.replace('#CLIP#', ''),
      account: Item.PK.replace('ACCOUNT#', ''),
      status:
        Object.keys(STATUSES).find(key => STATUSES[key] === Item.data.status) ||
        'Unknown',
      stats: Item.stats,
      meta: {
        ...Item.data,
        createdAt: getCreated(Item.SK.replace('#CLIP#', ''))
      },
      type: 'Clip'
    }

    delete item.meta.status

    return item
  }

  static getClipByID ({ accountId, clipId }) {
    return DocumentClient.get({
      TableName: process.env.DYNAMO_TABLE_NAME,
      Key: {
        PK: `ACCOUNT#${accountId}`,
        SK: `#CLIP#${clipId}`
      }
    })
      .promise()
      .then(({ Item }) => ({
        Item: this.toObject(Item)
      }))
      .catch(err => Promise.reject(err))
  }

  static queryUserClips ({ accountId, next, previous, Limit = 30 }) {
    return DocumentClient.query({
      TableName: process.env.DYNAMO_TABLE_NAME,
      KeyConditionExpression: `PK = :account and SK ${
        next ? '<' : previous ? '>' : '<='
      } :range`,
      ExpressionAttributeValues: {
        ':account': `ACCOUNT#${accountId}`,
        ':range':
          next || previous
            ? `#CLIP#${next || previous}`
            : `ACCOUNT#${accountId}`
      },
      ScanIndexForward: false,
      Limit
    })
      .promise()
      .then(({ Items, LastEvaluatedKey }) => ({
        Items: Items.map(i =>
          i.SK.startsWith('ACCOUNT#') ? Account.toObject(i) : this.toObject(i)
        ),
        LastEvaluatedKey
      }))
      .catch(err => Promise.reject(err))
  }

  static queryRecentClips ({
    start = { next: null, previous: null },
    Limit,
    maxPages
  }) {
    let allItems = []
    const loop = async ({ next, previous, page = 1 }) => {
      const time = next || previous ? getCreated(next || previous) : Date.now()

      const ExpressionAttributeValues = {
        ':recent': `RC#${generateId(time).substring(0, 4)}`
      }

      if (next || previous)
        ExpressionAttributeValues[':range'] = next || previous

      const [database_error, database_response] = await to(
        DocumentClient.query({
          TableName: process.env.DYNAMO_TABLE_NAME,
          IndexName: 'GSI2PK-GSI2SK-index',
          KeyConditionExpression: `GSI2PK = :recent${
            next
              ? ' and GSI2SK < :range'
              : previous
              ? ' and GSI2SK > :range'
              : ''
          }`,
          ExpressionAttributeValues: ExpressionAttributeValues,
          ScanIndexForward: false,
          Limit
        })
          .promise()
          .then(({ Items }) => ({
            Items: Items.map(i => this.toObject(i))
          }))
          .catch(err => Promise.reject(err))
      )

      if (database_error) return Promise.reject(database_error)

      const { Items } = database_response
      if (previous) allItems = [...Items, ...allItems]
      else allItems = [...allItems, ...Items]

      if (allItems.length >= Limit || page >= maxPages)
        return Promise.resolve({ Items: allItems, time })

      const pages = {
        next: previous
          ? null
          : Items.length === 0
          ? getPastULID(time)
          : Items[Items.length - 1].id,
        previous: !previous
          ? null
          : Items.length === 0
          ? getFutureULID(time)
          : Items[0].id,
        page: ++page
      }

      if (!next && !previous) return Promise.resolve({ Items: allItems, time })

      return loop(pages)
    }

    return loop(start)
  }
}
