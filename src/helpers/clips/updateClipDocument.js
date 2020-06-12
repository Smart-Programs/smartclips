import DocumentClient from '../../data/DocumentClient'

import config from '../../config'

export default function updateClipDocument ({ clip, status }) {
  const PK = `ACCOUNT#${clip.account}`
  const SK = `#CLIP#${clip.id}`

  return DocumentClient.update({
    TableName: config.DYNAMO_TABLE_NAME,
    Key: {
      PK,
      SK
    },
    UpdateExpression: 'SET #data.#status = :status',
    ExpressionAttributeNames: {
      '#status': 'status',
      '#data': 'data'
    },
    ExpressionAttributeValues: {
      ':status': status
    },
    ConditionExpression: 'attribute_exists(PK)'
  }).promise()
}
