import table from './_table'

import { Entity } from 'dynamodb-toolbox'

const AuthEntity = new Entity({
  name: 'Auth',

  timestamps: true,
  createdAlias: 'createdAt',
  modifiedAlias: 'updatedAt',

  attributes: {
    PK: {
      partitionKey: true,
      hidden: true,
      prefix: 'AUTH#',
      type: 'string',
      delimiter: '#'
    },
    SK: {
      sortKey: true,
      hidden: true,
      default: 'AUTH'
    },

    GSI1PK: {
      prefix: 'ACCOUNT#',
      hidden: true
    },
    GSI1SK: {
      prefix: 'AUTH#',
      hidden: true,
      default: data => data.provider.toUpperCase()
    },

    id: ['PK', 0, { type: 'string', required: true, save: false }],
    provider: [
      'PK',
      1,
      {
        type: 'string',
        required: true,
        save: false,
        transform: data => data.toUpperCase()
      }
    ],
    account: ['GSI1PK', 0, { type: 'number', required: true, save: false }],

    tokens: { type: 'map', required: true }
  },

  table
})

export default AuthEntity
