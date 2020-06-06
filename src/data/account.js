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
      braintreeId = ''
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
        beep: this.beep
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
      id: Item.PK.replace('ACCOUNT#', '')
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
}
