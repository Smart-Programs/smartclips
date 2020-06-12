import { respond } from '../../../helpers'

import config from '../../../config'

export function get (req, res) {
  return respond({
    res,
    body: {
      message: 'Welcome to the SmartClips API!',
      useful_pages: {
        get_started: `${config.BASE_URL}/dev (coming soon)`,
        entities: `${config.BASE_URL}/dev/entities (coming soon)`,
        errors: `${config.BASE_URL}/dev/errors (coming soon)`
      }
    }
  })
}
