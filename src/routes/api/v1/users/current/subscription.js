import Account from '../../../../../data/account'

// import { BraintreeGateway, Environment } from 'braintree'
import { DynamoDB } from 'aws-sdk'
import {
  getSubscription,
  respond,
  to,
  internalError,
  logger
} from '../../../../../helpers'
import { currentUserAuth } from '../../../../../helpers/validators'
import { compose } from 'compose-middleware'

const DocumentClient = new DynamoDB.DocumentClient({
  accessKeyId: process.env.DYNAMO_ACCESS_KEY,
  secretAccessKey: process.env.DYNAMO_ACCESS_SECRET,
  endpoint: process.env.DYNAMO_ENDPOINT,
  region: process.env.DYNAMO_REGION
})

// const gateway = new BraintreeGateway({
//   environment: Environment[process.env.BRAINTREE_ENV],
//   merchantId: process.env.BRAINTREE_MERCHANT,
//   privateKey: process.env.BRAINTREE_PRIVATE,
//   publicKey: process.env.BRAINTREE_PUBLIC
// })

// gateway.timeout = 5000

const getToken = async customerId =>
  gateway.clientToken.generate({ customerId })

export const get = compose([
  currentUserAuth.validate,
  async (req, res) => {
    const current = req.session.user

    const [database_error, database_response] = await to(
      DocumentClient.get({
        TableName: process.env.DYNAMO_TABLE_NAME,
        Key: {
          PK: `ACCOUNT#${current.account}`,
          SK: `ACCOUNT#${current.account}`
        }
      }).promise()
    )

    if (database_error) {
      logger.error(
        {
          request_id: req.request_id,
          error: { code: '1000', class: 'dynamo' }
        },
        database_error
      )

      return internalError({
        res,
        req,
        code: '1000'
      })
    }

    const { Item } = database_response
    const account = Account.toObject(Item, true)

    // TODO: Implement checking for subscription
    // const [braintree_error, braintree_responses] = await to(
    //   Promise.all([
    //     getToken(account.braintreeId ? account.braintreeId : undefined),
    //     getSubscription(account.braintreeId)
    //   ])
    // )

    // if (braintree_error || braintree_responses[0].success !== true) {
    //   return internalError({
    //     res,
    //     req,
    //     code: '2000'
    //   })
    // } else {
    //   const [data, subscription] = braintree_responses
    //   return respond({
    //     res,req,
    //     body: {
    //       ...subscription,
    //       token: data.clientToken
    //     }
    //   })
    // }

    return internalError({
      res,
      req,
      code: '9000'
    })
  }
])
