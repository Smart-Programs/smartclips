<script>
  import Card from "../clips/card.svelte";
  import VerticalSection from "../sections/VerticalSection.svelte";

  export let username,
    clips,
    page,
    userid,
    socials = [{ provider: "MIXER", id: 0 }];

  $: hasNext = !!page.next;

  let loadingMoreClips = false;

  async function loadClips() {
    if (!hasNext) return;

    loadingMoreClips = true;
    try {
      const response = await fetch(
        `api/v1/users/${userid}/clips?next=${page.next}`
      );
      const data = await response.json();

      if (response.status !== 200 || !data.Items || !Array.isArray(data.Items))
        throw new Error("Bad Response");

      const newClips = data.Items.filter(
        item => item.type === "Clip" && item.status === "SUCCESS"
      ).map(item => {
        return {
          title: item.meta.title,
          platform: item.meta.platform,
          id: `${item.account}/${item.id}`,
          username: username
        };
      });

      page = data.Page;

      if (newClips.length) {
        clips = [...clips, ...newClips];
      }

      loadingMoreClips = false;
    } catch (error) {
      loadingMoreClips = false;
      console.error(error);
    }
  }
</script>

<svelte:head>
  <title>SmartClips | Explore {username}'s clips</title>

  <meta property="og:site_name" content="SmartClips" />
  <meta
    property="og:title"
    content={`SmartClips | Explore ${username}'s clips`} />
  <meta
    property="og:description"
    content={`See what ${username} has been creating, and clipping.`} />

  <meta
    property="og:url"
    content={`${process.env.BASE_URL}/users/${username}`} />
  <meta property="og:type" content="website" />

  <meta
    property="og:image"
    content={`https://mixer.com/api/v1/users/${socials.find(item => item.provider === 'MIXER').id}/avatar`} />
</svelte:head>

<div class="pt-20 flex">
  <a
    href={encodeURI(`https://twitter.com/intent/tweet?text=You should check out ${username}'s profile on SmartClips. ${process.env.BASE_URL}/users/${username}`)}
    target="popup"
    rel="noreferrer noopener"
    class="flex-shrink-0 group block mx-auto focus:outline-none">
    <div class="flex items-center">
      <div>
        <img
          class="inline-block w-16 h-16 sm:h-24 sm:w-24 rounded-full"
          src={`https://mixer.com/api/v1/users/${socials.find(item => item.provider === 'MIXER').id}/avatar`}
          alt="User" />
      </div>
      <div class="ml-3 sm:ml-6">
        <p
          class="text-lg sm:text-4xl font-medium text-white
          group-hover:text-gray-200">
          {username}
        </p>
        <p
          class="text-xs text-center font-medium text-white
          group-hover:text-gray-200 group-focus:underline transition ease-in-out
          duration-150">
          Share profile
        </p>
      </div>
    </div>
  </a>
</div>

<div class="pt-12 px-4 sm:px-6 lg:px-8 lg:pt-20">
  <div class="text-center">
    <h1
      class="mt-3 max-w-4xl mx-auto text-xl leading-7 text-gray-300 sm:mt-5
      sm:text-2xl sm:leading-8">
      See what {username} has been creating, and clipping.
    </h1>
  </div>
</div>

<VerticalSection
  {Card}
  items={clips}
  reachedEnd={loadClips}
  loadingMoreBottom={loadingMoreClips}
  title={`${username}-recent`}
  showTitle={false} />
