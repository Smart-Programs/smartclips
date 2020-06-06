import { ulid } from 'ulid'

// ULID SPEC VALUES DO NOT CHANGE
const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ' // Crockford's Base32
const ENCODING_LEN = ENCODING.length
const TIME_MAX = Math.pow(2, 48) - 1
const TIME_LEN = 10
const RANDOM_LEN = 16

export function isULID (id) {
  if (
    typeof id !== 'string' ||
    id.length !== TIME_LEN + RANDOM_LEN ||
    !id.split('').every(char => ENCODING.indexOf(char) !== -1)
  )
    return false

  const time_id = id.substr(0, TIME_LEN)

  return isValidTimeULID(time_id)
}

function isValidTimeULID (time_id) {
  const parts = time_id.split('').reverse()

  const time_value = parts.reduce(
    (carry, char, index) =>
      (carry += ENCODING.indexOf(char) * Math.pow(ENCODING_LEN, index)),
    0
  )

  return time_value < TIME_MAX && time_value > 0
}

export const getPastULID = time =>
  `${ulid(
    time -
      (1000 * 60 * 60 * 24 * 12 + 1000 * 60 * 60 * 10 + 1000 * 60 * 15.697 + 4)
  ).substring(0, 4)}ZZZZZZZZZZZZZZZZZZZZZZ`

export const getFutureULID = time =>
  `${ulid(
    time +
      (1000 * 60 * 60 * 24 * 12 + 1000 * 60 * 60 * 10 + 1000 * 60 * 15.697 + 4)
  ).substring(0, 4)}0000000000000000000000`

export const ulidValidation = value => {
  if (!isULID(value)) return Promise.reject('Invalid value')
  else return true
}
