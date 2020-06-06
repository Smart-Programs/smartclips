import { respond } from '../../../../helpers'

function invalidRoute (req, res) {
  return respond({
    res,
    req,
    errors: {
      message: 'Not Found',
      list: [
        {
          value: req.path,
          msg: `Invalid value`,
          param: 'route',
          location: 'path'
        }
      ]
    },
    status: 404
  })
}

export {
  invalidRoute as get,
  invalidRoute as post,
  invalidRoute as put,
  invalidRoute as patch,
  invalidRoute as del
}
