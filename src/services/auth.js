import { Table, AuthEntity, AccountEntity } from '../models'
import { customAlphabet, nanoid } from 'nanoid'
import { to } from '../helpers'

const NUMBERS = '0123456789'
const ID_SIZE = 10

const generateId = length => Number(customAlphabet(NUMBERS, length)())

export default class AuthService {
  constructor () {}

  async SignInOrUp ({ provider: { name, userid, tokens } }) {
    const [error, auth] = await to(
      AuthEntity.get({ id: userid, provider: name })
    )

    if (error) return Promise.reject(error)

    if (Auth.Item === undefined) {
      return this.SignUp({ provider })
    } else {
      return this.SignIn({ provider, account: Auth.Item.account })
    }
  }

  async SignUp ({
    provider: { name: providerName, userid, tokens },
    user: { name: userName, email, verified, bio }
  }) {
    const accountId = generateId(ID_SIZE)

    const account = AccountEntity.putParams({
      id: accountId,
      name: userName,
      email,
      verified,
      bio
    }).Item

    const auth = AuthEntity.putParams({
      id: userid,
      provider: providerName,
      tokens,
      account: accountId
    }).Item

    const [error, results] = await to(
      Table.DocumentClient.transactWrite({
        TransactItems: [
          {
            Put: {
              TableName: Table.name,
              Item: auth,
              ConditionExpression: 'attribute_not_exists(PK)'
            }
          },
          {
            Put: {
              TableName: Table.name,
              Item: account,
              ConditionExpression: 'attribute_not_exists(PK)'
            }
          }
        ]
      }).promise()
    )

    if (error) return Promise.reject(error)
    else if (Object.keys(results.UnprocessedItems) !== 0)
      return Promise.reject(new Error('Unable to process items'))

    return {
      account: AccountEntity.parse(account),
      auth: AuthEntity.parse(auth)
    }
  }

  async SignIn ({ provider: { name, userid, tokens }, account }) {
    const [error, responses] = await to(
      Promise.all([
        AuthEntity.update({
          id: userid,
          provider: name,
          tokens: tokens
        }),
        AccountEntity.get({ id: account })
      ])
    )

    if (error) return Promise.reject(error)
    else if (responses[1] === undefined || responses[1].Item === undefined)
      return Promise.reject('Could not find account')

    const account = AccountEntity.parse(responses[1])

    return { account }
  }
}
