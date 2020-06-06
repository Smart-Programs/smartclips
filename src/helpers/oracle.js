const fs = require('fs')
const https = require('https')
const os = require('os')
const httpSignature = require('http-signature')
const jsSHA = require('jssha')

const privateKey = process.env.ORACLE_PRIVATE_KEY.split(':::').join('\n')
const apiKeyId = `${process.env.ORACLE_TENANCY_ID}/${process.env.ORACLE_USER_ID}/${process.env.ORACLE_KEY_FINGERPRINT}`

function sign (request, body = '') {
  let headersToSign = ['host', 'date', '(request-target)']

  const methodsThatRequireExtraHeaders = ['POST', 'PUT']

  if (
    methodsThatRequireExtraHeaders.indexOf(request.method.toUpperCase()) !== -1
  ) {
    const shaObj = new jsSHA('SHA-256', 'TEXT')
    shaObj.update(body)

    request.setHeader('Content-Length', Buffer.byteLength(body))
    request.setHeader('x-content-sha256', shaObj.getHash('B64'))

    headersToSign = headersToSign.concat([
      'content-type',
      'content-length',
      'x-content-sha256'
    ])
  }

  httpSignature.sign(request, {
    key: privateKey,
    keyId: apiKeyId,
    headers: headersToSign
  })

  const newAuthHeaderValue = request
    .getHeader('Authorization')
    .replace('Signature ', 'Signature version="1",')
  request.setHeader('Authorization', newAuthHeaderValue)
}

function handleRequest (callback) {
  return response =>
    response
      .on('data', () => {})
      .on('end', () => {
        callback({
          errored: response.statusCode > 202,
          status: response.statusCode
        })
      })
}

export function invokeFunction (body = {}) {
  return new Promise(resolve => {
    const stringBody = JSON.stringify(body)

    const request = https.request(
      {
        host: process.env.ORACLE_FUNCTIONS_HOST,
        path: process.env.ORACLE_FUNCTIONS_PATH,
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'fn-invoke-type': process.env.ORACLE_FUNCTIONS_INVOKE
        }
      },
      handleRequest(resolve)
    )

    sign(request, stringBody)
    request.write(stringBody)
    request.end()
  })
}
