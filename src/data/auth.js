import DocumentClient from './DocumentClient'

import config from '../config'

export default class Auth {
  constructor ({
    id,
    provider,
    account,
    tokens,
    secondary,
    createdAt = new Date()
  }) {
    this.id = id
    this.provider = provider
    this.account = account
    this.tokens = tokens

    if (secondary) this.secondary = secondary

    this.createdAt = createdAt.getTime()
  }

  key () {
    return {
      PK: `AUTH#${this.provider}#${this.id}`,
      SK: `AUTH#${this.provider}#${this.id}`
    }
  }

  gsi1Key () {
    return {
      GSI1PK: `ACCOUNT#${this.account}`,
      GSI1SK: `AUTH#${this.provider}`
    }
  }

  gsi2Key () {
    return {}
  }

  toItem () {
    const item = {
      ...this.key(),
      ...this.gsi1Key(),
      ...this.gsi2Key(),
      data: {
        createdAt: this.createdAt,
        tokens: this.tokens
      }
    }

    if (this.secondary) item.data.secondary = this.secondary

    return item
  }

  static toObject (Item, includeTokens = false) {
    if (!Item || !Item.data) return {}

    const provider = Item.GSI1SK.replace('AUTH#', '')

    if (!includeTokens) delete Item.data.tokens

    return {
      ...Item.data,
      provider: provider,
      id: Item.PK.replace(`${Item.GSI1SK}#`, ''),
      account: Item.GSI1PK.replace('ACCOUNT#', '')
    }
  }

  static getAuthProviderByID ({ provider, id }) {
    return DocumentClient.get({
      TableName: config.DYNAMO_TABLE_NAME,
      Key: {
        PK: `AUTH#${provider}#${id}`,
        SK: `AUTH#${provider}#${id}`
      }
    })
      .promise()
      .then(({ Item }) => ({
        Item: this.toObject(Item)
      }))
      .catch(err => Promise.reject(err))
  }

  static getAuthProviders ({ accountId, provider, includeTokens = false }) {
    const KeyConditionExpression = provider
      ? 'GSI1PK = :account AND GSI1SK = :platform'
      : 'GSI1PK = :account'
    const ExpressionAttributeValues = provider
      ? {
          ':account': `ACCOUNT#${accountId}`,
          ':platform': `AUTH#${provider}`
        }
      : {
          ':account': `ACCOUNT#${accountId}`
        }

    const Limit = provider ? 1 : 10

    return DocumentClient.query({
      TableName: config.DYNAMO_TABLE_NAME,
      IndexName: 'GSI1PK-GSI1SK-index',
      KeyConditionExpression,
      ExpressionAttributeValues,
      Limit
    })
      .promise()
      .then(({ Items, LastEvaluatedKey }) => ({
        Items: Items.map(i => this.toObject(i, includeTokens)),
        LastEvaluatedKey
      }))
      .catch(err => Promise.reject(err))
  }
}
