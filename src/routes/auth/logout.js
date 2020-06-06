import { respond } from '../../helpers'

export function get (req, res) {
  req.session.user = null
  res.statusCode = 302
  res.setHeader('location', req.query.returnTo || '/')
  return res.end()
}

export function post (req, res) {
  req.session.user = null
  return respond({ res, body: { user: null } })
}
