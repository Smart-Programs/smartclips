import axios from 'axios'
import getStreamFiles from './getStreamFiles'
import createClipDocument from './createClipDocument'
import updateClipDocument from '../updateClipDocument'

import { logger, to } from '../../index'
import { ulid as generateId } from 'ulid'
import { invokeFunction } from '../../oracle'

import config from '../../../config'

const STATUSES = {
  WORKING: 0,
  SUCCESS: 1,
  ERROR: 2
}

export default async function createClipMixer ({
  account,
  channelid,
  length,
  subscriber = false
}) {
  const [response_error, responses] = await to(
    Promise.all([
      getStreamFiles({ channelid, length }),
      axios.get(
        `https://mixer.com/api/v1/channels/${channelid}?fields=name,typeId`
      )
    ])
  )

  if (response_error)
    return Promise.resolve({
      created: false,
      message: `Internal Server Error`,
      code: '3000',
      errors: [
        {
          msg: `Could not complete the request`,
          location: 'internal-3000'
        }
      ],
      status: 500
    })

  const [stream, channel] = responses

  if (!stream.online)
    return Promise.resolve({
      created: false,
      message: `Not Live Error`,
      code: '3100',
      errors: [
        {
          msg: `In order to create a clip you must be live`,
          location: 'mixer-stream-3100'
        }
      ],
      status: 404
    })
  else if (stream.error)
    return Promise.resolve({
      created: false,
      message: `Stream tracking error`,
      code: '3100',
      errors: [
        {
          msg: stream.error,
          location: 'tracker-error-3100'
        }
      ],
      status: 500
    })
  else if (!stream.key)
    return Promise.resolve({
      created: false,
      message: `Stream Tracking Error`,
      code: '3100',
      errors: [
        {
          msg: `No stream id from Mixer manifest`,
          location: 'mixer-manifest-3100'
        }
      ],
      status: 500
    })
  else if (stream.time < 15 || stream.time < length / 2)
    return Promise.resolve({
      created: false,
      message: `Stream Tracking Error`,
      code: '3100',
      errors: [
        {
          msg: `Stream not tracked long enough`,
          location: 'mixer-stream-3100'
        }
      ],
      status: 400
    })

  const { key, files } = stream

  let clip = {}
  if (channel.status === 200 && channel.data.name && channel.data.typeId) {
    clip.title = channel.data.name
    clip.game = channel.data.typeId
  } else {
    clip.title = 'No Clip Title'
    clip.game = 0
  }

  const [document_error, document] = await to(
    createClipDocument({
      account,
      channelid,
      subscriber,
      status: STATUSES.WORKING,
      ...clip
    })
  )

  const invoke = {
    files,
    base: `https://videocdn.mixer.com/hls/${key}_source`,
    length,
    accountId: account.id,
    clipId: document.clip.id,
    gameId: clip.game,
    subscriber,
    S3_CONFIG: {
      accessKeyId: process.env.S3_ACCESS,
      secretAccessKey: process.env.S3_SECRET,
      endpoint: config.S3_ENDPOINT
    },
    S3_BUCKET: config.S3_BUCKET,
    DYNAMO_CONFIG: {
      accessKeyId: process.env.DYNAMO_ACCESS_KEY,
      secretAccessKey: process.env.DYNAMO_ACCESS_SECRET,
      endpoint: config.DYNAMO_ENDPOINT,
      region: config.DYNAMO_REGION
    }
  }

  if (process.env.NODE_ENV === 'development') {
    delete invoke.DYNAMO_CONFIG
  }

  const { errored, status } = await invokeFunction(invoke)

  if (document_error || errored) {
    return Promise.resolve({
      created: false,
      message: `Internal Server Error`,
      code: '1000',
      errors: [
        {
          msg: `Internal Server Error`,
          location: 'internal-1000'
        }
      ],
      status: 500
    })
  }

  if (process.env.NODE_ENV === 'development') {
    await to(
      updateClipDocument({ clip: document.clip, status: STATUSES.SUCCESS })
    )
  }

  return Promise.resolve({
    created: true,
    clip: document.clip,
    message: 'The clip has been created successfully.',
    url: `${config.BASE_URL}/clips/${document.clip.account}/${document.clip.id}`
  })
}
