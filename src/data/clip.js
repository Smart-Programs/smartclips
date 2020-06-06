import { ulid as generateId, decodeTime as getCreated } from 'ulid'

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
      }
    }

    delete item.meta.status

    return item
  }
}
