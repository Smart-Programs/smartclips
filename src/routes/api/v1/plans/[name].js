import { respond } from '../../../../helpers'

export function get (req, res) {
  if (req.params.name === 'test') {
    return respond({
      res,
      req,
      errors: {
        message: 'Not Found',
        list: [
          {
            value: req.params.name,
            msg: 'Not Found',
            param: 'name',
            location: 'param'
          }
        ]
      },
      status: 404
    })
  }

  return respond({
    req,
    res,
    body: {
      name: req.params.name
    }
  })
}
