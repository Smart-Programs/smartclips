export * from './ulid'
export * from './braintree'
export * from './logger'

export const to = promise => promise.then(r => [null, r]).catch(e => [e, null])

export const respond = ({
  res,
  req,
  body = {},
  errors = { message: '', list: [] },
  status = 200
}) => {
  res.setHeader('Content-Type', 'application/json')
  res.statusCode = status

  if (errors.message && errors.list.length > 0) {
    body.type = 'error'
    body.error = errors.message
    body.code = errors.message.toLowerCase().replace(/ /g, '_')
    body.context_info = {
      errors: errors.list,
      request_id: req.request_id
    }
  }

  return res.end(JSON.stringify(body))
}

export const internalError = ({ req, res, code }) => {
  return respond({
    res,
    req,
    errors: {
      message: 'Internal Server Error',
      list: [
        {
          msg: `Internal Server Error`,
          location: 'internal-' + code
        }
      ]
    },
    status: 500
  })
}
