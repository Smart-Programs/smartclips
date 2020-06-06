import pino from 'pino'
import logflare from 'pino-logflare'

const stream = logflare.createWriteStream({
  apiKey: process.env.LOGFLARE_API_KEY,
  source: process.env.LOGFLARE_SOURCE,
  size: 1
})

export const logger = pino(
  {
    name: process.env.NODE_ENV
  },
  stream
)
