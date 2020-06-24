import { config } from 'dotenv'

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

config()

export default {
  isDev: process.env.NODE_ENV === 'development',

  web: {
    port: process.env.PORT,
    base: 'https://preview.smartclips.app'
  },

  api: {
    base: 'https://preview.smartclips.app/api',
    mixer: 'https://mixer.com/api'
  },

  sessions: {
    cookie: 'sp_sc_id',
    secret: process.env.SESSIONS_SECRET
  },

  oauth: {
    mixer: {
      client: 'ec200f35c482f30139cd35c213cae7a795aba8f232cf7f74',
      secret: process.env.MIXER_SECRET,
      scope: [
        'chat:connect',
        'chat:chat',
        'chat:bypass_links',
        'chat:bypass_slowchat',
        'chat:whisper',
        'user:details:self',
        'channel:details:self',
        'channel:update:self'
      ],
      callback: '/auth/callback/mixer'
    },
    streamlabs: {
      client: '',
      secret: process.env.STREAMLABS_SECRET,
      scope: [],
      callback: '/auth/callback/streamlabs'
    }
  },

  oracle: {
    key: process.env.ORACLE_PRIVATE_KEY.split(':::').join('\n'),
    keyId: `ocid1.tenancy.oc1..${process.env.ORACLE_TENANCY_ID}/ocid1.user.oc1..${process.env.ORACLE_USER_ID}/${process.env.ORACLE_KEY_FINGERPRINT}`,
    host: 'idovg4rlvna.us-phoenix-1.functions.oci.oraclecloud.com',
    path:
      '/20181201/functions/ocid1.fnfunc.oc1.phx.aaaaaaaaabiaiqqf4lpktredujpooo5htdte6gmj64e7yldr3wnbyvjei3gq/actions/invoke',
    invoke: 'detached'
  },

  s3: {
    accessKeyId: process.env.S3_ACCESS,
    secretAccessKey: process.env.S3_SECRET,

    bucket: 'dev.smartclips.app',
    endpoint:
      'https://axdoipz9dgju.compat.objectstorage.us-phoenix-1.oraclecloud.com',
    files:
      'https://objectstorage.us-phoenix-1.oraclecloud.com/n/axdoipz9dgju/b/dev.smartclips.app/o'
  },

  dynamo: {
    accessKeyId: process.env.DYNAMO_ACCESS_KEY,
    secretAccessKey: process.env.DYNAMO_ACCESS_SECRET,
    region: 'us-west-2',

    TableName: 'SMARTCLIPS-PREVIEW'
  },

  braintree: {
    publicKey: process.env.BRAINTREE_PUBLIC,
    privateKey: process.env.BRAINTREE_PRIVATE,
    merchantId: process.env.BRAINTREE_MERCHANT,
    env: 'Sandbox'
  }
}
