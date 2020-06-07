# Clip Function

The purpose of the Clip Function is to actually create the clips, and upload them to S3 storage. To do this we rely on the data from the Tracker to get each video part that needs to be combined together, and uploaded.

## Creation

If you remember from our tracker, it will send you back a list of the video parts and the key for the url to each video part.

Tracker response example:

```
{
  "key": "160788-176a4be3792cef32bee2a32977e4ada2",
  "files": [
    {
      "time": 2,
      "ts": "3329568000.ts"
    },
    {
      "time": 2,
      "ts": "3329748000.ts"
    },
    {
      "time": 2,
      "ts": "3329928000.ts"
    },
    {...}
  ],
  "online": true
}
```

## What to do with this data

With this data we can build out the URL to each video part using the key. If you recall the URL starts with `https://videocdn.mixer.com/hls/` followed by the `key` value in the trackers response. Since we want source quality this is then followed by `_source`. Then each video part will be a file in that directory.

So for the example each video part URL will be:

- `https://videocdn.mixer.com/hls/160788-176a4be3792cef32bee2a32977e4ada2_source/3329568000.ts`
- `https://videocdn.mixer.com/hls/160788-176a4be3792cef32bee2a32977e4ada2_source/3329748000.ts`
- `https://videocdn.mixer.com/hls/160788-176a4be3792cef32bee2a32977e4ada2_source/3329928000.ts`

Knowing that we have to use FFmpeg to download and concat those files, as well as transmuxed to MP4. To allow easy playback, and download for users.

Thats the basics of how the clipping function works feel free to create your own clipping function.
