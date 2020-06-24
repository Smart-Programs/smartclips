import table from './_table'

import { Entity } from 'dynamodb-toolbox'
import { customAlphabet, nanoid } from 'nanoid'

const NUMBERS = '0123456789'

const ID_SIZE = 10
const HASH_SIZE = 4
const API_TOKEN_SIZE = 16

const generateId = length => Number(customAlphabet(NUMBERS, length)())

const emailRegex = new RegExp(
  '^(?=[A-Z0-9][A-Z0-9@._%+-]{5,253}$)[A-Z0-9._%+-]{1,64}@(?:(?=[A-Z0-9-]{1,63}.)[A-Z0-9]+(?:-[A-Z0-9]+)*.){1,8}[A-Z]{2,63}$',
  'i'
)

const AccountEntity = new Entity({
  name: 'Account',

  timestamps: true,
  createdAlias: 'createdAt',
  modifiedAlias: 'updatedAt',

  attributes: {
    PK: {
      partitionKey: true,
      hidden: true,
      prefix: 'ACCOUNT#'
    },
    SK: {
      sortKey: true,
      hidden: true,
      default: 'ACCOUNT'
    },

    GSI1PK: {
      prefix: 'USER#',
      hidden: true,
      default: data => data.name.toUpperCase()
    },
    GSI1SK: {
      prefix: 'USER#',
      hidden: true,
      transform: data => data.toUpperCase()
    },

    GSI2PK: {
      alias: 'api',
      prefix: 'API#',
      type: 'string',
      default: data => `${data.PK}-${nanoid(API_TOKEN_SIZE)}`
    },
    GSI2SK: {
      hidden: true,
      default: 'API'
    },

    id: ['PK', 0, { type: 'number', default: () => generateId(ID_SIZE) }],

    email: {
      type: 'string',
      required: true,
      transform: val => {
        if (!val.match(emailRegex)) throw new Error('Email is not valid.')

        return val
      }
    },
    verified: {
      type: 'boolean',
      required: true,
      hidden: true,
      transform: val => {
        if (val !== true) throw new Error('Email is not verified.')

        return val
      }
    },

    name: ['GSI1SK', 0, { type: 'string', required: true }],
    hash: [
      'GSI1SK',
      1,
      { type: 'number', save: false, default: () => generateId(HASH_SIZE) }
    ],

    bio: {
      type: 'string',
      default: () => 'No user bio.',
      transform: val => val.substring(0, 500)
    },

    usage: { type: 'string', hidden: true, delimiter: '#' },
    clipsToday: ['usage', 0, { type: 'number', save: false, default: 0 }],
    lastClip: [
      'usage',
      1,
      { type: 'number', save: false, default: () => Date.now() }
    ],

    beep: { type: 'boolean', default: false },
    braintree: { type: 'string', default: null },

    role: { type: 'string', default: 'user' },

    stats: {
      type: 'map',
      default: {
        totals: {
          clips: 0,
          views: 0,
          likes: 0,
          comments: 0
        },
        current: {
          clips: 0,
          views: 0,
          likes: 0,
          comments: 0
        }
      }
    }
  },

  table
})

export default AccountEntity
