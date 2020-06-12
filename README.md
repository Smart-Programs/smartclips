# SmartClips

The easiest way to create and share clips for streamers. https://smartclips.app

Note that the current version of SmartClips is based on a completely different system than what is currently in this repo. We have been working on reworking everything from the ground up. The current work in here can be seen at https://preview.smartclips.app

If you would like to help we would appreciate it! Let us know if you need any help by contacting us [support@smartprograms.co](mailto:support@smartprograms.co) or by creating an issue.

## Required

- NodeJS: [Download Here](https://nodejs.org/en/download/)
- DynamoDB Local: [Download Here](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html)
- Mixer OAuth Application: [Create Here](https://mixer.com/lab/oauth)
- Braintree (For subscription stuff): [Create Sandbox](https://www.braintreepayments.com/sandbox)

## Other stuff

- S3 Bucket (For clip uploads): [List of S3 Providers](https://help.servmask.com/knowledgebase/list-of-s3-compatible-storage-providers/)
- Oracle Function (To create a clip -- this is more advanced and not an open sourced part of SmartClips): [Oracle Cloud](https://www.oracle.com/cloud/)

## Required Environment Variables

These environment variables should go in a `.env` file.

- DYNAMO_ACCESS_KEY (anything if using local)
- DYNAMO_ACCESS_SECRET (anything if using local)

- BRAINTREE_PRIVATE (Use your braintree Private key)
- BRAINTREE_PUBLIC (Use your braintree Public key)
- BRAINTREE_MERCHANT (Use your braintree Merchant ID)

- MIXER_SECRET (Your client secret from your OAuth Application)

- SESSIONS_SECRET (use anything)

- NODE_ENV (Use "development")

Example `.env` file:

```
DYNAMO_ACCESS_KEY=test
DYNAMO_ACCESS_SECRET=test

BRAINTREE_PRIVATE=aaa
BRAINTREE_PUBLIC=bbb
BRAINTREE_MERCHANT=ccc

MIXER_SECRET=zzzzzzzzz

SESSIONS_SECRET=testing

NODE_ENV=development
```

## Config File Example (Used for public variables and to reduce amount of env vars - I uh reached a limit on vercel)

```js
export default {
  BASE_URL: 'http://localhost:3000',
  BASE_API_URL: 'http://localhost:3000/api',

  MIXER_BASE_API: (version = 1) => `https://mixer.com/api/v${version}`,
  MIXER_CLIENT: 'my-mixer-client-id',
  MIXER_SCOPE:
    'chat:connect chat:chat chat:bypass_links chat:bypass_slowchat chat:whisper user:details:self channel:details:self channel:update:self',

  OAUTH_CALLBACK: platform => `/auth/callback/${platform}`,

  ORACLE_FUNCTIONS_INVOKE: 'detached',
  ORACLE_FUNCTIONS_API: ({
    host = 'my_oracle_host_id',
    id = 'my_oracle_function_id'
  }) => ({
    host: `${host}.us-phoenix-1.functions.oci.oraclecloud.com`,
    path: `/20181201/functions/ocid1.fnfunc.oc1.phx.${id}/actions/invoke`
  }),
  ORACLE_API_KEY: ({ tenancy, user, fingerprint }) =>
    `ocid1.tenancy.oc1..${tenancy}/ocid1.user.oc1..${user}/${fingerprint}`, // uses the env vars for oracle

  S3_BUCKET: 'my-bucket',
  S3_ENDPOINT: 'https://link/to/s3/endpoint',
  S3_FILES_URL: 'https://link/to/s3/objects',

  SESSIONS_COOKIE: 'session_id',

  DYNAMO_TABLE_NAME: 'TEST',
  DYNAMO_REGION: 'us-west-2',
  DYNAMO_ENDPOINT: 'http://localhost:8000',

  BRAINTREE_ENV: 'Sandbox'
}
```

## Other Environment Variables

Follow the same convention for defining this as the required environment variables.

#### Tracker - Required for creating clips

- TRACKER_URL (A URL to a Mixer channel tracker to get their manifest files)

#### S3 - Requires Oracle (otherwise it has no use)

- S3_SECRET (Use your S3 Secret key)
- S3_ACCESS (Use your S3 Access key)

#### Oracle - Requires S3

- ORACLE_PRIVATE_KEY (Your Oracle Private Key using ":::" to delimit a new line)
- ORACLE_KEY_FINGERPRINT (Your Oracle Private Key fingerprint)
- ORACLE_TENANCY_ID (Your Oracle Tenancy ID)
- ORACLE_USER_ID (Your Oracle User ID)

#### Logflare

- LOGFLARE_API_KEY (Your logflare API key)
- LOGFLARE_SOURCE (Your logflare source)

## Running

Once you have all the required environment variables run `npm run dev` and it will start the server on port 3000.

# Resources

#### Error Code Specification

https://www.notion.so/smartprograms/SmartClips-Errors-40c8582816f145b08d1a6ee421fea03f

#### Stream Tracker

[Documentation for creating your own Stream Tracker](docs/TRACKER.md)

#### Clip Function

[Documentation for creating your own Clip Function](docs/CLIP.md)
