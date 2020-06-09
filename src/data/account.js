import DocumentClient from './DocumentClient'

import { customAlphabet, nanoid } from 'nanoid'

const NUMBERS = '0123456789'
const ID_SIZE = 10

const generateId = customAlphabet(NUMBERS, ID_SIZE)

const HASH_SIZE = 4
const generateHash = customAlphabet(NUMBERS, HASH_SIZE)

const API_TOKEN_SIZE = 16

export default class Account {
  constructor (
    {
      id,
      name,
      hash,
      email,
      verified = false,
      bio = '',
      createdAt = new Date(),
      day = 0,
      last = new Date(),
      api,
      beep = false,
      totalClips = 0,
      totalClipViews = 0,
      totalClipLikes = 0,
      totalClipComments = 0,
      currentClips = 0,
      currentClipViews = 0,
      currentClipLikes = 0,
      currentClipComments = 0,
      braintreeId = '',
      partner = false
    },
    validate = false
  ) {
    if (id) this.id = id
    else this.id = generateId()

    if (hash) this.hash = hash
    else this.hash = generateHash()

    this.name = name
    this.email = email
    this.verified = verified
    this.search = name.toUpperCase()
    this.createdAt = createdAt.getTime()

    this.bio = bio

    if (api) this.api = api
    else this.api = `${this.id}-${nanoid(API_TOKEN_SIZE)}`

    this.beep = beep

    this.day = day
    this.last = last.getTime()

    if (validate) this.validate()

    this.stats = {
      total: {
        views: totalClipViews,
        likes: totalClipLikes,
        comments: totalClipComments,
        clips: totalClips
      },
      current: {
        views: currentClipViews,
        likes: currentClipLikes,
        comments: currentClipComments,
        clips: currentClips
      }
    }

    this.braintreeId = braintreeId
    this.partner = partner
  }

  validate () {
    if (!this.email || !this.email.includes('@') || !this.email.includes('.'))
      throw new Error('User must have a valid email')
    else if (this.verified !== true)
      throw new Error('User must have a verified email')
    else if (!this.name || typeof this.name !== 'string')
      throw new Error('User must have a name')
    else if (!isNaN(Number(this.name)))
      throw new Error("User's name cannot be a number")
    else if (
      !this.name.match(/[a-zA-Z0-9_-]+/) ||
      this.name.match(/current/i) ||
      this.name.length < 1 ||
      this.name.length > 24
    )
      throw new Error("User's name invalid")
  }

  key () {
    return {
      PK: `ACCOUNT#${this.id}`,
      SK: `ACCOUNT#${this.id}`
    }
  }

  gsi1Key () {
    return {
      GSI1PK: `USER#${this.search}`,
      GSI1SK: `USER#${this.search}#${this.hash}`
    }
  }

  gsi2Key () {
    return {
      GSI2PK: `API#${this.api}`,
      GSI2SK: `API#${this.api}`
    }
  }

  toItem () {
    return {
      ...this.key(),
      ...this.gsi1Key(),
      ...this.gsi2Key(),
      data: {
        name: this.name,
        hash: this.hash,
        email: this.email,
        verified: this.verified,
        createdAt: this.createdAt,
        bio: this.bio,
        beep: this.beep,
        partner: this.partner
      },
      usage: {
        day: this.day,
        last: this.last
      },
      stats: this.stats,
      braintreeId: this.braintreeId || null
    }
  }

  static toObject (Item, includePrivates = false) {
    if (!Item || !Item.data) return {}

    const object = {
      ...Item.data,
      id: Item.PK.replace('ACCOUNT#', ''),
      type: 'Account'
    }

    if (includePrivates) {
      object.api = Item.GSI2PK.replace('API#', '')
      object.usage = Item.usage
      object.braintreeId = Item.braintreeId
    } else {
      delete object.email
      delete object.verified
      delete object.beep
    }

    return object
  }

  static getByID ({ accountId, includePrivates = false }) {
    if (isNaN(Number(accountId)))
      throw new Error('Invalid accountId at getByID')

    return DocumentClient.get({
      TableName: process.env.DYNAMO_TABLE_NAME,
      Key: {
        PK: `ACCOUNT#${accountId}`,
        SK: `ACCOUNT#${accountId}`
      }
    })
      .promise()
      .then(({ Item }) => ({ Item: this.toObject(Item, includePrivates) }))
      .catch(err => Promise.reject(err))
  }

  static getAllByID ({ accountIds }) {
    return DocumentClient.batchGet({
      RequestItems: {
        [process.env.DYNAMO_TABLE_NAME]: {
          Keys: accountIds
        }
      }
    })
      .promise()
      .then(({ Responses }) => ({
        Items: Responses[process.env.DYNAMO_TABLE_NAME].map(Item =>
          this.toObject(Item)
        )
      }))
      .catch(err => Promise.reject(err))
  }

  static getByAPIKey ({ apiKey = '', includePrivates = false }) {
    if (apiKey.match(/([0-9]+)-(.+)/).length === 0)
      throw new Error('Invalid apiKey at getByAPIKey')

    return DocumentClient.query({
      TableName: process.env.DYNAMO_TABLE_NAME,
      IndexName: 'GSI2PK-GSI2SK-index',
      KeyConditionExpression: 'GSI2PK = :key and GSI2SK = :key',
      ExpressionAttributeValues: {
        ':key': `API#${apiKey}`
      },
      Limit: 1
    })
      .promise()
      .then(({ Items }) => ({
        Item:
          Items.length === 0 ? null : this.toObject(Items[0], includePrivates)
      }))
      .catch(err => Promise.reject(err))
  }

  static queryByUsernameAndHash ({
    username = '',
    hash = '',
    includePrivates = false
  }) {
    if (!isNaN(Number(username))) throw new Error('Invalid username at getByID')
    else if (isNaN(Number(hash))) throw new Error('Invalid hash at getByID')

    return DocumentClient.query({
      TableName: process.env.DYNAMO_TABLE_NAME,
      IndexName: 'GSI1PK-GSI1SK-index',
      KeyConditionExpression:
        'GSI1PK = :username and begins_with(GSI1SK, :usernameWithHash)',
      ExpressionAttributeValues: {
        ':username': `USER#${username.toUpperCase()}`,
        ':usernameWithHash': `USER#${username.toUpperCase()}#${hash}`
      }
    })
      .promise()
      .then(({ Items, LastEvaluatedKey }) => ({
        Items: Items.map(Item => this.toObject(Item, includePrivates)),
        LastEvaluatedKey
      }))
      .catch(err => Promise.reject(err))
  }
}
