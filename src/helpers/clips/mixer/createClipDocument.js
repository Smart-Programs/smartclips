import DocumentClient from '../../../data/DocumentClient'
import axios from 'axios'

import config from '../../../config'

import { Clip } from '../../../data'

const dateIsToday = (date, now = new Date()) =>
  date.getFullYear() === now.getFullYear() &&
  date.getMonth() === now.getMonth() &&
  date.getDate() === now.getDate()

export default function createClipDocument ({
  account,
  channelid,
  status = 0,
  subscriber = false,
  clipid,
  created
}) {
  return new Promise(async (resolve, reject) => {
    const [_, response] = await to(
      axios.get(
        `https://mixer.com/api/v1/channels/${channelid}?fields=name,typeId`
      )
    )

    let clip
    if (response.data) {
      clip = new Clip(
        {
          account: account.id,
          platform: 'MIXER',
          title: response.data.name,
          game: response.data.typeId,
          status: status,
          id: clipid,
          createdAt: created
        },
        subscriber
      )
    } else {
      clip = new Clip(
        {
          account,
          platform: 'MIXER',
          status: status,
          id: clipid,
          createdAt: created
        },
        subscriber
      )
    }

    const [error, results] = await to(
      DocumentClient.transactWrite({
        TransactItems: [
          {
            Put: {
              TableName: config.DYNAMO_TABLE_NAME,
              Item: clip.toItem(),
              ConditionExpression: 'attribute_not_exists(PK)'
            }
          },
          {
            Update: {
              TableName: config.DYNAMO_TABLE_NAME,
              Key: {
                PK: `ACCOUNT#${account.id}`,
                SK: `ACCOUNT#${account.id}`
              },
              UpdateExpression: 'SET #usage = :usage',
              ExpressionAttributeNames: {
                '#usage': 'usage'
              },
              ExpressionAttributeValues: {
                ':usage': {
                  day: dateIsToday(new Date(account.usage.last))
                    ? isNaN(Number(account.usage.day + 1))
                      ? 1
                      : Number(account.usage.day + 1)
                    : 1,
                  last: Date.now()
                }
              },
              ConditionExpression: 'attribute_exists(PK)'
            }
          }
        ]
      }).promise()
    )

    if (error) return reject(error)
    else return resolve({ clip: Clip.toObject(clip.toItem()) })
  })
}

function to (promise) {
  return promise.then(r => [null, r]).catch(e => [e, null])
}
