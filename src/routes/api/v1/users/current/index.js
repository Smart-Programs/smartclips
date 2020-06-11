import { compose } from 'compose-middleware'
import { Account } from '../../../../../data'
import { respond } from '../../../../../helpers'
import { currentUserAuth } from '../../../../../helpers/validators'

export const get = compose([
  currentUserAuth.validateAndSet,
  async (req, res) => {
    return respond({
      res,
      req,
      body: req.current,
      status: 200
    })
  }
])
