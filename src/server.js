import * as sapper from '@sapper/server'

import sirv from 'sirv'
import polka from 'polka'
import compression from 'compression'
import bodyParser from 'body-parser'
import session from 'cookie-session'

import { ulid } from 'ulid'
import { logger } from './helpers'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

let cookie = dev
  ? {}
  : {
      sameSite: 'strict',
      httpOnly: true
    }

const app = polka()
  .use(
    bodyParser.json(),
    session({
      keys: process.env.SESSIONS_SECRET.split(','),
      resave: false,
      saveUninitialized: false,
      unset: 'destroy',
      cookie: cookie,
      name: process.env.SESSIONS_COOKIE
    }),
    (req, res, next) => {
      req.request_id = ulid()

      logger.info({ request_id: req.request_id })

      next()
    },
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    sapper.middleware({
      session: (req, res) => {
        return { user: req.session.user, referrer: req.session.referrer }
      }
    })
  )
  .listen(PORT, err => {
    if (err) logger.error(err)
  })

export default app.handler
