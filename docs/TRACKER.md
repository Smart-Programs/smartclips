# Stream Tracker

The purpose of the stream tracker is to keep a history of a users stream. This includes their online state, and the video parts in their HLS stream.

## HLS

The HLS (HTTP Live Stream) is what is considered the non-low latency stream on Mixer. This protocol splits out every stream into multiple video files that will get served back to users. We will use these files for creating clips.

#### How to get the source stream

In order to get the source or manifest file you need to first get the users channelid. For this example we will use Monstercat since they are always online.

Their id is: `160788`

In order to get their HLS source we must use the `/channels/{id}/manifest.light2` route from Mixer's API. `https://mixer.com/api/v1/channels/160788/manifest.light2`

This returns the following response:

```
{
  "accessKey": "160788-176a4be3792cef32bee2a32977e4ada2",
  "hlsSrc": "/api/v1/channels/160788/manifest.m3u8?accessKey=160788-176a4be3792cef32bee2a32977e4ada2",
  "isTestStream": false,
  "now": "2020-06-07T01:10:59.7202333+00:00",
  "startedAt": "2020-05-30T14:42:19.4031800-07:00"
}
```

With this you can see their HLS source is `https://mixer.com/api/v1/channels/160788/manifest.m3u8?accessKey=160788-176a4be3792cef32bee2a32977e4ada2` denoted by the `hlsSrc` value in the response. If you go to that URL in your browser it will download a file. Open this in your text editor, and you can see the multiple stream qualities for the stream.

Manifest file:

```
#EXTM3U
#EXT-X-VERSION:3

#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=4000000,RESOLUTION=1920x1080,NAME=source(1080p)
https://videocdn.mixer.com/hls/160788-176a4be3792cef32bee2a32977e4ada2_source/index.m3u8

#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=1500000,RESOLUTION=854x480,NAME=480p
https://videocdn.mixer.com/hls/160788-176a4be3792cef32bee2a32977e4ada2_480p/index.m3u8

#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=200000,RESOLUTION=284x160,NAME=160p
https://videocdn.mixer.com/hls/160788-176a4be3792cef32bee2a32977e4ada2_160p/index.m3u8

#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=500000,RESOLUTION=568x320,NAME=320p
https://videocdn.mixer.com/hls/160788-176a4be3792cef32bee2a32977e4ada2_320p/index.m3u8

#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=3000000,RESOLUTION=1280x720,NAME=720p
https://videocdn.mixer.com/hls/160788-176a4be3792cef32bee2a32977e4ada2_720p/index.m3u8
```

Since SmartClips always uses source quality we will use the source quality stream. `https://videocdn.mixer.com/hls/160788-176a4be3792cef32bee2a32977e4ada2_source/index.m3u8`

If you now go to that stream source, and download it you will get a list of video parts that you can download, and view.

Stream file:

```
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-MEDIA-SEQUENCE:308779
#EXT-X-TARGETDURATION:2
#EXTINF:2.000,
55648512810.ts
#EXTINF:2.000,
55648692810.ts
#EXTINF:2.000,
55648872810.ts
#EXTINF:2.000,
55649052810.ts
#EXTINF:2.000,
55649232810.ts
#EXTINF:2.000,
55649412810.ts
#EXTINF:2.000,
55649592810.ts
#EXTINF:2.000,
55649772810.ts
```

Each numbered file represents a video part that can be accessed by using the same URL as before but replacing `index.m3u8` with the numbered file followed by `.ts`.

For example if you were to want to download the first video part in this stream you would go to the url `https://videocdn.mixer.com/hls/160788-176a4be3792cef32bee2a32977e4ada2_source/55648512810.ts` this will be a short 2 second video file denoted by EXTINF (note that if a user drops frames the values may be inconsistent).

## What to do with this data

The Stream Trackers job is to make sure and always keep our list of those video parts up to date so that we can download them later in order to create clips. We do this by pinging back the Stream File which lists the video parts every 5 seconds for every user streaming.

Our tracker sends back a response that looks similar to this:

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

The key value is the portion of the HLS stream that defines the url to the source file. Note the part taken from this URL: `https://videocdn.mixer.com/hls/160788-176a4be3792cef32bee2a32977e4ada2_source/index.m3u8` (after /hls/ and before \_source).

That is the basics of how the Stream Tracker works if you want to create one yourself to create clips feel free!
