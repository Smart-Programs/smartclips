export default {
  BASE_URL: 'https://prod.smartclips.app',
  BASE_API_URL: 'https://prod.smartclips.app/api',

  MIXER_BASE_API: (version = 1) => `https://mixer.com/api/v${version}`,
  MIXER_CLIENT: '06b7ea18fe5091b7145677fc2ed2f6fdcc99eca33fb614ff',
  MIXER_SCOPE:
    'chat:connect chat:chat chat:bypass_links chat:bypass_slowchat chat:whisper user:details:self channel:details:self channel:update:self',

  OAUTH_CALLBACK: platform => `/auth/callback/${platform}`,

  ORACLE_FUNCTIONS_INVOKE: 'detached',
  ORACLE_FUNCTIONS_API: ({
    host = 'idovg4rlvna',
    id = 'aaaaaaaaabiaiqqf4lpktredujpooo5htdte6gmj64e7yldr3wnbyvjei3gq'
  }) => ({
    host: `${host}.us-phoenix-1.functions.oci.oraclecloud.com`,
    path: `/20181201/functions/ocid1.fnfunc.oc1.phx.${id}/actions/invoke`
  }),
  ORACLE_API_KEY: ({ tenancy, user, fingerprint }) =>
    `ocid1.tenancy.oc1..${tenancy}/ocid1.user.oc1..${user}/${fingerprint}`,

  S3_BUCKET: 'dev.smartclips.app',
  S3_ENDPOINT:
    'https://axdoipz9dgju.compat.objectstorage.us-phoenix-1.oraclecloud.com',
  S3_FILES_URL:
    'https://objectstorage.us-phoenix-1.oraclecloud.com/n/axdoipz9dgju/b/dev.smartclips.app/o',

  SESSIONS_COOKIE: 'sp_sc_id',

  DYNAMO_TABLE_NAME: 'SMARTCLIPS-PREVIEW',
  DYNAMO_REGION: 'us-west-2',

  BRAINTREE_ENV: 'Sandbox'
}
