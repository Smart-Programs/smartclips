import { query, param, oneOf, validationResult } from 'express-validator'
import { isULID, ulidValidation, respond } from './'

const validate = (req, res, next) => {
  const errors = validationResult(req)

  if (errors.isEmpty()) return next()

  return respond({
    res,
    req,
    errors: {
      message: 'Bad Request',
      list: errors.array()
    },
    status: 400
  })
}

export const getUserClip = {
  checks: [param('clipid').custom(ulidValidation)],
  validate
}

const VALID_PLATFORMS = ['MIXER']

export const createUserClip = {
  checks: [
    query('token').matches(/([0-9]+)-(.+)/),
    query('platform')
      .customSanitizer(v => {
        if (!v) return VALID_PLATFORMS[0]
        else return v.toUpperCase()
      })
      .isIn(VALID_PLATFORMS),
    query('length')
      .customSanitizer(v => {
        if (!v || isNaN(Number(v))) return 30
        else return Number(v)
      })
      .isInt({ min: 15, max: 90 })
  ],
  validate
}

export const getRecentClips = {
  checks: [
    query('next')
      .optional({ checkFalsy: true })
      .custom(ulidValidation)
      .custom((value, { req }) => {
        if (req.query.previous)
          return Promise.reject('Both previous and next are defined')

        return true
      }),
    query('previous')
      .optional({ checkFalsy: true })
      .custom(ulidValidation)
      .custom((value, { req }) => {
        if (req.query.next)
          return Promise.reject('Both next and previous are defined')

        return true
      }),
    query('limit')
      .customSanitizer(v => {
        if (!v) return 50
        else return Number(v)
      })
      .isInt({ min: 1, max: 1000 })
  ],
  validate
}

export const getUserClips = {
  checks: [
    query('next')
      .optional({ checkFalsy: true })
      .custom(ulidValidation)
      .custom((value, { req }) => {
        if (req.query.previous)
          return Promise.reject('Both previous and next are defined')

        return true
      }),
    query('previous')
      .optional({ checkFalsy: true })
      .custom(ulidValidation)
      .custom((value, { req }) => {
        if (req.query.next)
          return Promise.reject('Both next and previous are defined')

        return true
      }),
    query('includeSocials').customSanitizer(value => value !== undefined)
  ],
  validate
}

export const getUserById = {
  checks: [
    query('includeSocials').customSanitizer(value => value !== undefined)
  ],
  validate
}

export const getUserByUsername = {
  checks: [
    oneOf([
      query('hash')
        .customSanitizer(value => value || '')
        .isInt({ min: 0, max: 9999 }),
      query('hash')
        .customSanitizer(value => value || '')
        .isEmpty()
    ])
  ],
  validate
}

export const currentUserAuth = {
  validate: (req, res, next) => {
    const current = req.session.user

    if (!current || !current.account) {
      return respond({
        res,
        req,
        errors: {
          message: 'Bad Authorization',
          list: [
            {
              msg: `Value is invalid`,
              param: 'token',
              location: 'query'
            }
          ]
        },
        status: 401
      })
    }

    next()
  }
}
