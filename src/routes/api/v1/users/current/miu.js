import { compose } from 'compose-middleware'
import { Account } from '../../../../../data'
import { respond } from '../../../../../helpers'
import { currentUserAuth } from '../../../../../helpers/validators'

import config from '../../../../../config'

const MIU = `{"$type":"MixItUp.Base.Commands.ChatCommand, MixItUp.Base","IncludeExclamationInCommands":true,"Wildcards":false,"Requirements":{"$type":"MixItUp.Base.ViewModel.Requirement.RequirementViewModel, MixItUp.Base","Role":{"$type":"MixItUp.Base.ViewModel.Requirement.RoleRequirementViewModel, MixItUp.Base","MixerRole":10,"CustomRole":null},"Cooldown":{"$type":"MixItUp.Base.ViewModel.Requirement.CooldownRequirementViewModel, MixItUp.Base","Type":0,"Amount":30,"GroupName":null},"Currency":null,"Rank":null,"Inventory":null,"Threshold":{"$type":"MixItUp.Base.ViewModel.Requirement.ThresholdRequirementViewModel, MixItUp.Base","Amount":0,"TimeSpan":0},"Settings":{"$type":"MixItUp.Base.ViewModel.Requirement.SettingsRequirementViewModel, MixItUp.Base","DeleteChatCommandWhenRun":false,"DontDeleteChatCommandWhenRun":false,"PatreonBenefitIDRequirement":null,"ShowOnChatMenu":false},"UserRole":0},"ID":"1eb2802d-996d-4843-9195-649c30975083","StoreID":"00000000-0000-0000-0000-000000000000","Name":"Clip","Type":0,"Commands":["clip"],"IsEnabled":true,"IsBasic":false,"Unlocked":false,"GroupName":null,"IsRandomized":false,"Actions":[
{"$type":"MixItUp.Base.Actions.SpecialIdentifierAction, MixItUp.Base","SpecialIdentifierName":"TOKEN","SpecialIdentifierReplacement":"%USER_API_TOKEN%","MakeGloballyUsable":false,"SpecialIdentifierShouldProcessMath":false,"ID":"ceb13d93-ee65-4685-8b83-494ee1e6dc70","Type":16,"Label":"API Token"},
{"$type":"MixItUp.Base.Actions.WebRequestAction, MixItUp.Base","Url":"${config.BASE_API_URL}/v1/clips/create?token=$TOKEN","ResponseAction":4,"ResponseChatText":null,"ResponseCommandID":"00000000-0000-0000-0000-000000000000","ResponseCommandArgumentsText":null,"SpecialIdentifierName":null,"JSONToSpecialIdentifiers":{"$type":"System.Collections.Generic.Dictionary\`2[[System.String, mscorlib],[System.String, mscorlib]], mscorlib","type":"type","error":"error","clip_url":"clip"},"ResponseCommandName":null,"ID":"edf74542-f30c-4547-8a40-82b02def6e08","Type":14,"Label":"Create Clip Request"},{"$type":"MixItUp.Base.Actions.ConditionalAction, MixItUp.Base","IgnoreCase":true,"Operator":0,"ComparisionType":0,"Value1":null,"Value2":null,"Value3":null,"Clauses":[{"$type":"MixItUp.Base.Actions.ConditionalClauseModel, MixItUp.Base","ComparisionType":0,"Value1":"$type","Value2":"error","Value3":null}],"CommandID":"00000000-0000-0000-0000-000000000000","Action":{"$type":"MixItUp.Base.Actions.ChatAction, MixItUp.Base","ChatText":"Oops the clip was not created. Error: $error","IsWhisper":false,"WhisperUserName":null,"SendAsStreamer":false,"ID":"0868824a-93e5-43aa-99fe-86165965a5a4","Type":0,"Label":"Chat Message"},"ID":"eed1c887-1be3-4801-8543-50d5438dc2e6","Type":23,"Label":"Conditional Error"},{"$type":"MixItUp.Base.Actions.ConditionalAction, MixItUp.Base","IgnoreCase":true,"Operator":0,"ComparisionType":0,"Value1":null,"Value2":null,"Value3":null,"Clauses":[{"$type":"MixItUp.Base.Actions.ConditionalClauseModel, MixItUp.Base","ComparisionType":1,"Value1":"$type","Value2":"error","Value3":null}],"CommandID":"00000000-0000-0000-0000-000000000000","Action":{"$type":"MixItUp.Base.Actions.ChatAction, MixItUp.Base","ChatText":"The clip was created successfully, and can be viewed at $clip!","IsWhisper":false,"WhisperUserName":null,"SendAsStreamer":false,"ID":"f4f58215-5324-4ef5-b90a-129d6277030a","Type":0,"Label":"Chat Message"},"ID":"57be5d47-acd5-43dc-ab5b-d17a1620e2dc","Type":23,"Label":"Conditional Success"}]}`

export const get = compose([
  currentUserAuth.validateAndSet,
  async (req, res) => {
    const { api, name } = req.current

    const actionFile = MIU.replace('%USER_API_TOKEN%', api)

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${name}_smartclips.mixitupc`
    )
    res.setHeader('Content-Type', 'text/plain')
    res.end(actionFile)
  }
])
