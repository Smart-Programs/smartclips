<script>
  import formatDistance from "date-fns/formatDistance";
  import { onMount } from "svelte";

  export let title,
    videoid,
    clipid,
    username,
    platform,
    createdAt = Date.now();

  $: shortName =
    username.length > 20 ? `${username.substring(0, 17)}...` : username;

  let videoLocation = `process.env.S3_FILES_URL/${videoid}.mp4`;
</script>

<div
  class="flex flex-col flex-inverse-auto rounded bg-gray-900 shadow m-2
  overflow-hidden">
  <div>
    <video class="w-full" controls>
      <source src={videoLocation} type="video/mp4" />
    </video>
  </div>

  <h1 class="p-4 text-lg truncate text-white">{title}</h1>

  <p class="p-4 text-xs text-gray-200 mt-auto">
    <a href={`/users/${username}`} class="hover:underline hover:text-blue-500">
      {shortName} on {platform}
    </a>
    • {formatDistance(createdAt, new Date(), { addSuffix: true })}
    <a
      class="float-right"
      target="popup"
      rel="noreferrer noopener"
      href={encodeURI(`https://twitter.com/intent/tweet?text=Check out this clip by ${username}.\n"${title}" - https://smartclips.app/clips/${username}/${clipid}`)}
      aria-label="share clip">
      <span>Share</span>
      <svg width="24" height="24" class="inline">
        <rect width="24" height="24" fill="none" rx="0" ry="0" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M17 10C19.2091 10 21 8.20914 21 6C21 3.79086 19.2091 2 17 2C14.7909
          2 13 3.79086 13 6C13 6.44376 13.0723 6.87064 13.2057 7.26952L9.90706
          9.25245C9.17789 8.48121 8.14514 8 7 8C4.79086 8 3 9.79086 3 12C3
          14.2091 4.79086 16 7 16C8.14608 16 9.17958 15.518 9.90885
          14.7457L13.2074 16.7252C13.0729 17.1256 13 17.5543 13 18C13 20.2091
          14.7909 22 17 22C19.2091 22 21 20.2091 21 18C21 15.7909 19.2091 14 17
          14C15.8535 14 14.8197 14.4823 14.0904 15.2551L10.7922 13.2758C10.927
          12.8751 11 12.4461 11 12C11 11.5527 10.9266 11.1226 10.7911
          10.721L14.0861 8.74027C14.8156 9.51576 15.8513 10 17 10ZM19.8 18C19.8
          19.5464 18.5464 20.8 17 20.8C15.4536 20.8 14.2 19.5464 14.2 18C14.2
          16.4536 15.4536 15.2 17 15.2C18.5464 15.2 19.8 16.4536 19.8 18ZM19.8
          6C19.8 7.5464 18.5464 8.8 17 8.8C15.4536 8.8 14.2 7.5464 14.2 6C14.2
          4.4536 15.4536 3.2 17 3.2C18.5464 3.2 19.8 4.4536 19.8 6ZM9.8 12C9.8
          13.5464 8.5464 14.8 7 14.8C5.4536 14.8 4.2 13.5464 4.2 12C4.2 10.4536
          5.4536 9.2 7 9.2C8.5464 9.2 9.8 10.4536 9.8 12Z"
          fill="#ffffff" />
      </svg>
    </a>
  </p>

</div>
