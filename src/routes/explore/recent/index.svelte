<script context="module">
  export async function preload() {
    try {
      const recent = await this.fetch(`api/v1/clips/recent`, {
        credentials: "include"
      });
      let { Items: ClipItems, Page } = await recent.json();

      if (recent.status !== 200)
        return this.error(
          500,
          "Could not load clip data. Please try again later."
        );

      ClipItems = ClipItems.map(item => {
        return {
          title: item.meta.title,
          id: `${item.account}/${item.id}`,
          username: item.User.name,
          platform: item.meta.platform,
          createdAt: item.meta.createdAt
        };
      });

      return Promise.resolve({ ClipItems, Page, preloaded: ClipItems.length });
    } catch (error) {
      console.error(error);
      return this.error(
        500,
        "Could not load clip data. Please try again later."
      );
    }
  }
</script>

<script>
  import Card from "../../../components/clips/card.svelte";

  import VerticalSection from "../../../components/sections/VerticalSection.svelte";

  export let ClipItems = [],
    Page = {},
    preloaded = null;

  let loadingMoreClips = false,
    hasMoreClips = true;

  const loadMoreClips = async (force = false) => {
    if (
      (hasMoreClips && !loadingMoreClips && Page && Page.next) ||
      force === true
    ) {
      loadingMoreClips = true;
      try {
        const recent = await fetch(`api/v1/clips/recent?next=${Page.next}`, {
          credentials: "include"
        });
        let { Items: MoreClips, Page: NextPage, extras } = await recent.json();

        if (recent.status !== 200) throw new Error("Could not load more clips");

        MoreClips = MoreClips.map(item => {
          return {
            title: item.meta.title,
            id: `${item.account}/${item.id}`,
            username: item.User.name,
            platform: item.meta.platform,
            createdAt: item.meta.createdAt
          };
        });

        Page = NextPage;

        if (extras && extras.assumedLast && extras.assumedLast.passed) {
          hasMoreClips = false;
          loadingMoreClips = false;
        } else if (MoreClips.length === 0) {
          loadMoreClips(true);
        } else {
          ClipItems = [...ClipItems, ...MoreClips];
          loadingMoreClips = false;
        }
      } catch (error) {
        loadingMoreClips = false;
        console.error("DONE ERROR", error);
        // TODO: SHOW ERROR
      }
    }
  };

  if (preloaded === 0) loadMoreClips();
</script>

<svelte:head>
  <title>SmartClips | Explore what has recently been happening on Mixer</title>

  <meta property="og:site_name" content="SmartClips" />
  <meta
    property="og:title"
    content="SmartClips | Explore what has recently been happening on Mixer" />
  <meta
    property="og:description"
    content="Keep up to date with what is happening recently on Mixer." />

  <meta property="og:url" content="https://smartclips.app/explore/recent" />
  <meta property="og:type" content="website" />
</svelte:head>

<div class="pt-12 px-4 sm:px-6 lg:px-8 lg:pt-20">
  <div class="text-center">
    <h1
      class="mt- text-3xl leading-9 font-extrabold text-white sm:text-4xl
      sm:leading-10 lg:text-5xl lg:leading-none">
      Explore what's recent!
    </h1>
    <p
      class="mt-3 max-w-4xl mx-auto text-xl leading-7 text-gray-300 sm:mt-5
      sm:text-2xl sm:leading-8">
      Keep up to date with what is happening recently on Mixer.
    </p>
  </div>
</div>

<VerticalSection
  {Card}
  items={ClipItems}
  reachedEnd={loadMoreClips}
  loadingMoreBottom={loadingMoreClips} />
