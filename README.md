# SmartClips

The easiest way to create and share clips for streamers. https://smartclips.app (Slowly moving over most stuff)

## Required

- NodeJS: [Download Here](https://nodejs.org/en/download/)
- DynamoDB Local: [Download Here](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html)
- Mixer OAuth Application: [Create Here](https://mixer.com/lab/oauth)

## Recommended

- Braintree (For subscription stuff -- may be required for some things): [Create Sandbox](https://www.braintreepayments.com/sandbox)

## Other stuff

- S3 Bucket (For clip uploads): [List of S3 Providers](https://help.servmask.com/knowledgebase/list-of-s3-compatible-storage-providers/)
- Oracle Function (To create a clip -- this is more advanced and not an open sourced part of SmartClips): [Oracle Cloud](https://www.oracle.com/cloud/)

## Required Environment Variables

These environment variables should go in a `.env` file.

- DYNAMO_TABLE_NAME (anything if using local)
- DYNAMO_ACCESS_KEY (anything if using local)
- DYNAMO_ACCESS_SECRET (anything if using local)
- DYNAMO_REGION (use us-west-2 if using local)
- DYNAMO_ENDPOINT (http://localhost:8000 if using local)

- MIXER_API (Use "https://mixer.com/api/v1")
- MIXER_CLIENT (Your client ID from your OAuth Application)
- MIXER_SECRET (Your client secret from your OAuth Application)
- MIXER_SCOPE (Use "chat:connect chat:chat chat:bypass_links chat:bypass_slowchat chat:whisper user:details:self channel:details:self channel:update:self")
- MIXER_REDIRECT (Use "http://localhost:3000/auth/callback/mixer")

- SESSIONS_SECRET (use anything)
- SESSIONS_COOKIE (use anything)

- NODE_ENV (Use "development")

Example `.env` file:

```
DYNAMO_TABLE_NAME=TEST
DYNAMO_ACCESS_KEY=test
DYNAMO_ACCESS_SECRET=test
DYNAMO_REGION=us-west-2
DYNAMO_ENDPOINT=http://localhost:8000

MIXER_API=https://mixer.com/api/v1
MIXER_CLIENT=aaaaaaaaa
MIXER_SECRET=zzzzzzzzz
MIXER_SCOPE="chat:connect chat:chat chat:bypass_links chat:bypass_slowchat chat:whisper user:details:self channel:details:self channel:update:self"
MIXER_REDIRECT=http://localhost:3000/auth/callback/mixer

SESSIONS_SECRET=testing
SESSIONS_COOKIE=session_id

NODE_ENV=development
```

## Other Environment Variables

Follow the same convention for defining this as the required environment variables.

#### Braintree

- BRAINTREE_ENV (Use "Sandbox")
- BRAINTREE_PRIVATE (Use your braintree Private key)
- BRAINTREE_PUBLIC (Use your braintree Public key)
- BRAINTREE_MERCHANT (Use your braintree Merchant ID)

#### S3 - Requires Oracle (otherwise it has no use)

- S3_BUCKET (Your S3 Bucket name)
- S3_SECRET (Use your S3 Secret key)
- S3_ACCESS (Use your S3 Access key)
- S3_ENDPOINT (Use your S3 Bucket endpoint)
- S3_FILES_URL (Use the url to access files in you S3 bucket)

#### Oracle - Requires S3

- ORACLE_PRIVATE_KEY (Your Oracle Private Key)
- ORACLE_KEY_FINGERPRINT (Your Oracle Private Key fingerprint)
- ORACLE_TENANCY_ID (Your Oracle Tenancy ID)
- ORACLE_USER_ID (Your Oracle User ID)
- ORACLE_FUNCTIONS_HOST (The host of your Oracle clipping function)
- ORACLE_FUNCTIONS_PATH (The path of your Oracle clipping function)
- ORACLE_FUNCTIONS_INVOKE ("sync" for development "detached" on production)

#### Logflare

- LOGFLARE_API_KEY (Your logflare API key)
- LOGFLARE_SOURCE (Your logflare source)

## Running

Once you have all the required environment variables run `npm run dev` and it will start the server on port 3000.
