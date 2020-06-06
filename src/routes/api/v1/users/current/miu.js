import Account from '../../../../../data/account'

import { respond, to, internalError, logger } from '../../../../../helpers'
import { currentUserAuth } from '../../../../../helpers/validators'
import { compose } from 'compose-middleware'
import { DynamoDB } from 'aws-sdk'

const DocumentClient = new DynamoDB.DocumentClient({
  accessKeyId: process.env.DYNAMO_ACCESS_KEY,
  secretAccessKey: process.env.DYNAMO_ACCESS_SECRET,
  endpoint: process.env.DYNAMO_ENDPOINT,
  region: process.env.DYNAMO_REGION
})

const MIU = `{"$type":"MixItUp.Base.Commands.ChatCommand, MixItUp.Base","IncludeExclamationInCommands":true,"Wildcards":false,"Requirements":{"Role":{"MixerRole":10,"CustomRole":null},"Cooldown":{"Type":0,"Amount":0,"GroupName":null},"Currency":null,"Rank":null,"Inventory":null,"Threshold":{"Amount":0,"TimeSpan":0},"Settings":{"DeleteChatCommandWhenRun":false,"DontDeleteChatCommandWhenRun":false,"PatreonBenefitIDRequirement":null,"ShowOnChatMenu":false},"UserRole":0},"ID":"1eb2802d-996d-4843-9195-649c30975083","StoreID":"00000000-0000-0000-0000-000000000000","Name":"Clip","Type":0,"Commands":["clip"],"Actions":[{"$type":"MixItUp.Base.Actions.WebRequestAction, MixItUp.Base","Url":"https://smartclips.app/api/v1/clips/create?token=%USER_API_TOKEN%&platform=MIXER&length=$arg1text&type=text","ResponseAction":1,"ResponseChatText":"$webrequestresult","ResponseCommandID":"00000000-0000-0000-0000-000000000000","ResponseCommandArgumentsText":null,"SpecialIdentifierName":null,"JSONToSpecialIdentifiers":null,"ResponseCommandName":null,"ID":"be987ed4-f824-4f03-9a61-919d5f009bd6","Type":14,"Label":"Web Request"}],"IsEnabled":true,"IsBasic":false,"Unlocked":false,"GroupName":null,"IsRandomized":false}`

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

    if (!Item) {
      logger.error(
        {
          request_id: req.request_id,
          error: { code: '1200', class: 'dynamo' }
        },
        database_error
      )

      return respond({
        res,
        req,
        errors: {
          message: 'Not Found',
          list: [
            {
              msg: `Invalid account`,
              location: 'internal',
              code: '1200'
            }
          ]
        },
        status: 404
      })
    }

    const formattedItem = Account.toObject(Item, true)

    const actionFile = MIU.replace('%USER_API_TOKEN%', formattedItem.api)

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${formattedItem.name}_smartclips.mixitupc`
    )
    res.setHeader('Content-Type', 'text/plain')
    res.end(actionFile)
  }
])
