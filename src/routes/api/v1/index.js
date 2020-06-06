import { respond } from '../../../helpers'

export function get (req, res) {
  return respond({
    res,
    body: {
      message: 'Welcome to the SmartClips API!',
      useful_pages: {
        get_started: 'https://smartclips.app/dev (coming soon)',
        entities: 'https://smartclips.app/dev/entities (coming soon)',
        errors: 'https://smartclips.app/dev/errors (coming soon)'
      }
    }
  })
}
