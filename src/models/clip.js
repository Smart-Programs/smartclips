import table from './_table'

import { Entity } from 'dynamodb-toolbox'
import { ulid } from 'ulid'

const ClipEntity = new Entity({
  name: 'Clip',

  timestamps: true,
  createdAlias: 'createdAt',
  modifiedAlias: 'updatedAt',

  attributes: {
    PK: {
      partitionKey: true,
      hidden: true,
      prefix: 'ACCOUNT#',
      type: 'string',
      delimiter: '#'
    },
    SK: {
      sortKey: true,
      hidden: true,
      prefix: '#CLIP#',
      type: 'string',
      delimiter: '#'
    },

    id: [
      'SK',
      0,
      { type: 'string', default: data => ulid(Date.now()), save: false }
    ],
    game: { type: 'number', default: 0 },
    account: ['PK', 0, { type: 'number', required: true, save: false }],

    title: {
      type: 'string',
      default: 'No clip title.',
      transform: data => data.substring(0, 150)
    },
    status: { type: 'number', default: 0 },
    platform: {
      type: 'string',
      default: 'MIXER',
      transform: data => data.toUpperCase()
    },

    sub: { type: 'boolean', save: false, default: false },

    stats: {
      type: 'map',
      default: data => {
        if (data.sub === true) {
          return {
            views: data.views,
            likes: data.likes,
            comments: data.comments
          }
        } else {
          return {}
        }
      }
    },

    views: { type: 'number', save: false, default: 0 },
    likes: { type: 'number', save: false, default: 0 },
    comments: { type: 'number', save: false, default: 0 }
  },

  table
})

export default ClipEntity
