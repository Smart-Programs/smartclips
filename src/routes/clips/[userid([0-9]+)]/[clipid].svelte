<script context="module">
  export async function preload(page, { user }) {
    const { userid, clipid } = page.params;

    try {
      const user_response = await this.fetch(
        `api/v1/users/${userid}?includeSocials`
      );
      const { User, Socials } = await user_response.json();

      if (!User)
        this.error(user_response.status, data.message || "Could not get user.");

      const { name } = User;

      const response = await this.fetch(`api/v1/clips/${userid}/${clipid}`);
      const data = await response.json();

      if (response.status !== 200 || !data.status === "SUCCESS")
        this.error(response.status, data.message || "Could not get clip.");

      return Promise.resolve({
        clipid,
        userid,
        username: name,
        meta: data.meta,
        socials: Socials
      });
    } catch (error) {
      this.error(500, "Could not get user.");
    }
  }
</script>

<script>
  import VideoPlayer from "../../../components/clips/player.svelte";
  export let username, userid, clipid, meta, socials;
</script>

<svelte:head>
  <title>SmartClips | {username} - {meta.title}</title>

  <meta property="og:site_name" content="SmartClips" />
  <meta
    property="og:title"
    content={`SmartClips | ${username} - ${meta.title}`} />
  <meta property="og:description" content={meta.title} />

  <meta
    property="og:url"
    content={`https://smartclips.app/clips/${username}/${clipid}`} />
  <meta property="og:type" content="video.other" />
  <meta
    property="og:video"
    content={`process.env.S3_FILES_URL/${userid}/${clipid}.mp4`} />
  <meta property="og:video:type" content="video/mp4" />
</svelte:head>

<div class="p-10 flex">
  <a
    href={`/users/${username}`}
    class="flex-shrink-0 group block mx-auto focus:outline-none">
    <div class="flex items-center">
      <div>
        <img
          class="inline-block h-24 w-24 rounded-full"
          src={`https://mixer.com/api/v1/users/${socials.find(item => item.provider === 'MIXER').id}/avatar`}
          alt="User" />
      </div>
      <div class="ml-6">
        <p class="text-4xl font-medium text-white group-hover:text-gray-200">
          {username}
        </p>
        <p
          class="text-xs text-center font-medium text-white
          group-hover:text-gray-200 group-focus:underline transition ease-in-out
          duration-150">
          View profile
        </p>
      </div>
    </div>
  </a>
</div>

<div class="pt-10 pb-20 mb-20 mx-auto w-11/12 lg:w-10/12 xl:w-9/12">
  <VideoPlayer
    title={meta.title}
    videoid={`${userid}/${clipid}`}
    {clipid}
    {username}
    platform={meta.platform}
    createdAt={meta.createdAt} />
</div>
