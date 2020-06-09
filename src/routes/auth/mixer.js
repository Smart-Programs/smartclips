import DocumentClient from '../../data/DocumentClient'
import axios from 'axios'

import { Account, Auth } from '../../data'

const respond = (res, { body = {}, status = 200 }) => {
  res.setHeader('Content-Type', 'application/json')
  res.statusCode = status
  return res.end(JSON.stringify(body))
}

// TODO: Add in compose/validator to check values are present & handle errors to my spec
export async function post (req, res) {
  const { code, state } = req.body
  const current = req.session.user

  if (!code) {
    return respond(res, {
      body: {
        type: 'error',
        message: 'Bad Request',
        code: 'bad_request',
        context_info: {
          errors: [
            {
              reason: 'missing_code',
              message: `code is required`,
              name: 'code',
              location: 'request-body'
            }
          ]
        },
        request_id: req.request_id
      },
      status: 400
    })
  }

  let userState = {}

  if (state) {
    try {
      userState = JSON.parse(Buffer.from(state, 'base64').toString())
    } catch (error) {}
  }

  const [code_error, authorization] = await to(
    axios.post('https://mixer.com/api/v1/oauth/token', {
      grant_type: 'authorization_code',
      client_id: process.env.MIXER_CLIENT,
      client_secret: process.env.MIXER_SECRET,
      redirect_uri: params.redirect_uri,
      code: code
    })
  )

  if (code_error || !authorization) {
    return respond(res, {
      body: {
        type: 'error',
        message: 'Mixer server error',
        code: 'mixer_error',
        context_info: {
          errors: [
            {
              reason: 'mixer_unauthorized',
              message: `Mixer unauthorized error`,
              name: 'internal',
              location: 'mixer'
            }
          ]
        },
        request_id: req.request_id
      },
      status: 401
    })
  }

  const [user_error, data] = await to(
    Promise.all([
      axios.get('https://mixer.com/api/v1/users/current', {
        headers: {
          Authorization:
            authorization.data.token_type +
            ' ' +
            authorization.data.access_token
        }
      }),
      axios.post('https://mixer.com/api/v1/oauth/token/introspect', {
        token: authorization.data.access_token
      })
    ])
  )

  if (user_error || !data || data.length !== 2) {
    return respond(res, {
      body: {
        type: 'error',
        message: 'Mixer server error',
        code: 'mixer_error',
        context_info: {
          errors: [
            {
              reason: 'mixer_api_error',
              message: `Mixer api error`,
              name: 'internal',
              location: 'mixer'
            }
          ]
        },
        request_id: req.request_id
      },
      status: 500
    })
  }

  const [user, introspect] = data

  const currentScopes = introspect.data.scope.split(' ')
  const needs = params.scope.split(' ')

  if (!needs.every(v => currentScopes.findIndex(scope => scope === v) !== -1)) {
    return respond(res, {
      body: {
        type: 'error',
        message: 'Unprocessable entity',
        code: 'unprocessable_entity',
        context_info: {
          errors: [
            {
              reason: 'invalid_scopes',
              message: `scopes must contain all of [${needs.join(' ')}]`,
              name: 'scopes',
              location: 'authorize-request-query'
            }
          ]
        },
        request_id: req.request_id
      },
      status: 422
    })
  }

  let account

  try {
    account = new Account(
      {
        name: user.data.username,
        email: user.data.email,
        bio: user.data.bio,
        verified: user.data.verified
      },
      true
    )
  } catch (error) {
    return respond(res, {
      body: {
        type: 'error',
        message: 'Invalid account',
        code: 'invalid_account',
        context_info: {
          errors: [
            {
              reason: 'internal_error_4004',
              message: `Invalid account error`,
              name: 'internal',
              location: 'internal-4004'
            }
          ]
        },
        request_id: req.request_id
      },
      status: 500
    })
  }

  authorization.data.expires_at =
    Date.now() + 1000 * authorization.data.expires_in

  const auth = new Auth({
    id: user.data.id,
    secondary: user.data.channel.id,
    account: account.id,
    provider: 'MIXER',
    tokens: authorization.data
  })

  let created = true

  const [database_error, database_response] = await to(
    Auth.getAuthProviderByID({ provider: 'MIXER', id: user.data.id })
  )

  if (database_error) {
    return respond(res, {
      body: {
        type: 'error',
        message: 'Internal server error',
        code: 'internal_error',
        context_info: {
          errors: [
            {
              reason: 'internal_error_1000',
              message: `Internal server error`,
              name: 'internal',
              location: 'internal-1000'
            }
          ]
        },
        request_id: req.request_id
      },
      status: 500
    })
  }

  const { Item } = database_response

  let accountData = {}
  let authData = auth.toItem()

  if (!Item) {
    created = true
    const [transact_error, transact_results] = await to(
      DocumentClient.transactWrite({
        TransactItems: [
          {
            Put: {
              TableName: process.env.DYNAMO_TABLE_NAME,
              Item: auth.toItem(),
              ConditionExpression: 'attribute_not_exists(PK)'
            }
          },
          {
            Put: {
              TableName: process.env.DYNAMO_TABLE_NAME,
              Item: account.toItem(),
              ConditionExpression: 'attribute_not_exists(PK)'
            }
          }
        ]
      }).promise()
    )

    if (transact_error) {
      console.log(transact_error)
      return respond(res, {
        body: {
          type: 'error',
          message: 'Internal server error',
          code: 'internal_error',
          context_info: {
            errors: [
              {
                reason: 'internal_error_1100',
                message: `Internal server error`,
                name: 'internal',
                location: 'internal-1100'
              }
            ]
          },
          request_id: req.request_id
        },
        status: 500
      })
    }

    accountData = account.toItem()
  } else {
    created = false

    account.id = Item.account

    const [promise_error, promise_results] = await to(
      Promise.all([
        DocumentClient.update({
          TableName: process.env.DYNAMO_TABLE_NAME,
          Key: auth.key(),
          UpdateExpression: 'set #data.#tokens = :tokens',
          ExpressionAttributeNames: {
            '#tokens': 'tokens',
            '#data': 'data'
          },
          ExpressionAttributeValues: {
            ':tokens': auth.tokens
          }
        }).promise(),
        DocumentClient.get({
          TableName: process.env.DYNAMO_TABLE_NAME,
          Key: account.key()
        }).promise()
      ])
    )

    if (promise_error || promise_results.length !== 2) {
      return respond(res, {
        body: {
          type: 'error',
          message: 'Internal server error',
          code: 'internal_error',
          context_info: {
            errors: [
              {
                reason: 'internal_error_1001',
                message: `Internal server error`,
                name: 'internal',
                location: 'internal-1001'
              }
            ]
          },
          request_id: req.request_id
        },
        status: 500
      })
    }

    const { Item: accountItem } = promise_results[1]

    accountData = accountItem
  }

  req.session.user = {
    avatar: `https://mixer.com/api/v1/users/${user.data.id}/avatar`,
    username: accountData.data.name,
    hash: accountData.data.hash,
    email: accountData.data.email,
    bio: accountData.data.bio,
    account: account.id
  }

  const body = { user: req.session.user, state: userState, created: created }

  if (userState.includeApiKey === true) body.apiKey = accountData.api

  return respond(res, {
    body,
    status: 200
  })
}

const params = {
  client_id: process.env.MIXER_CLIENT,
  redirect_uri: process.env.MIXER_REDIRECT,
  scope: process.env.MIXER_SCOPE,
  response_type: 'code'
}

const queryString = Object.keys(params)
  .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
  .join('&')

const url = state =>
  `https://mixer.com/oauth/authorize?${queryString}&state=${state}`

export async function get (req, res) {
  let { returnTo, includeApiKey } = req.query

  if (!includeApiKey || includeApiKey !== 'true') includeApiKey = false
  else includeApiKey = true

  const allowedDomains = [
    'https://smartclips.app',
    'https://beep.nyda.pro',
    'http://localhost'
  ]

  if (returnTo && returnTo.match(/http(s?):\/\/.*/)) {
    let good = false
    allowedDomains.forEach(domain => {
      if (returnTo.startsWith(domain)) good = true
    })

    if (!good) {
      res.statusCode = 302
      res.setHeader(
        'location',
        '/?notice=Could Not Login. An invalid redirect domain was provided for login. If you were not expecting this message please contact us.'
      )
      return res.end()
    }
  }

  res.statusCode = 302
  res.setHeader(
    'location',
    url(
      Buffer.from(
        JSON.stringify({ returnTo: returnTo || '/', includeApiKey })
      ).toString('base64')
    )
  )
  return res.end()
}

function to (prom) {
  return prom.then(r => [null, r]).catch(e => [e, null])
}
