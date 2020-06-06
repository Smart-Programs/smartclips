import axios from 'axios'

export default function getStreamFiles ({ channelid, length }) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://trackers.smartprograms.workers.dev/${channelid}`)
      .then(async ({ data: { files, key, error, online }, status }) => {
        if (status !== 200)
          throw new Error(`Server returned bad status: ${status}`)

        if (online === false) resolve({ online })
        else if (error) resolve({ online, error, key })
        else if (!key) resolve({ online, key })
        else {
          let time = 0
          const sorted = files
            .reverse()
            .map(e => {
              if (time >= length) return null
              time += e.time
              return e
            })
            .filter(e => !!e)
            .reverse()
            .map(e => e.ts)

          resolve({ online, key, time, files: sorted })
        }
      })
      .catch(reject)
  })
}
