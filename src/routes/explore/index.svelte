<script context="module">
  export async function preload() {
    try {
      const recent = await this.fetch(`api/v1/clips/recent`, {
        credentials: "include"
      });
      let { Items: RecentItems } = await recent.json();

      if (recent.status !== 200)
        return this.error(
          500,
          "Could not load clip data. Please try again later."
        );

      RecentItems = RecentItems.map(item => {
        return {
          title: item.meta.title,
          id: `${item.account}/${item.id}`,
          username: item.User.name,
          platform: item.meta.platform,
          createdAt: item.meta.createdAt
        };
      });

      return Promise.resolve({ RecentItems });
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
  import Card from "../../components/clips/smallcard.svelte";
  import GameCard from "../../components/games/card.svelte";
  import CreatorCard from "../../components/creators/card.svelte";

  import HorizontalSection from "../../components/sections/HorizontalSection.svelte";
  import VerticalSection from "../../components/sections/VerticalSection.svelte";

  export let RecentItems = [];

  let PopularCreators = [];

  for (let i = 0; i < 10; i++) {
    if (i === 0) {
      PopularCreators.push({
        id: "0",
        username: "Testing"
      });
    } else {
      PopularCreators.push({
        id: "106384260",
        username: "OfficerStealth"
      });
    }
  }

  let Games = [];
  for (let i = 0; i < 10; i++) {
    if (i === 9) {
      Games.push({
        id: "0",
        title: "Testing"
      });
    } else {
      Games.push({
        id: "573566",
        title: "VALORANT"
      });
    }
  }

  let loadingMoreGames = false;
</script>

<style>
  ::-webkit-scrollbar {
    height: 8px;
    width: 4px;
    background: #777;

    border-radius: 8px;
  }

  ::-webkit-scrollbar-thumb:horizontal {
    background: #000;
    border-radius: 8px;
  }
</style>

<svelte:head>
  <title>SmartClips | Explore all that has been happening on Mixer</title>

  <meta property="og:site_name" content="SmartClips" />
  <meta
    property="og:title"
    content="SmartClips | Explore all that has been happening on Mixer" />
  <meta
    property="og:description"
    content="Keep up to date with what is happening in your favorite games, or
    from your favorite creators." />

  <meta property="og:url" content="https://smartclips.app/explore" />
  <meta property="og:type" content="website" />
</svelte:head>

<div class="pt-12 px-4 sm:px-6 lg:px-8 lg:pt-20">
  <div class="text-center">
    <h1
      class="mt- text-3xl leading-9 font-extrabold text-white sm:text-4xl
      sm:leading-10 lg:text-5xl lg:leading-none">
      Explore what's been happening!
    </h1>
    <h2
      class="mt-3 max-w-4xl mx-auto text-xl leading-7 text-gray-300 sm:mt-5
      sm:text-2xl sm:leading-8">
      Keep up to date with what is happening in your favorite games, or from
      your favorite creators.
    </h2>
  </div>
</div>

<!-- RECENT CLIPS -->
<HorizontalSection
  title="Recent Clips"
  {Card}
  items={RecentItems}
  link="explore/recent" />

<!-- POPULAR CLIPS -->
<HorizontalSection
  title="Popular Clips"
  {Card}
  items={RecentItems}
  link="explore/popular" />

<!-- POPULAR CREATORS -->
<HorizontalSection
  title="Popular Creators"
  Card={CreatorCard}
  items={PopularCreators}
  link="explore/creators" />

<!-- Games -->
<VerticalSection
  title="Games"
  Card={GameCard}
  items={Games}
  reachedEnd={() => {
    if (Games.length < 50) {
      loadingMoreGames = true;
      setTimeout(() => {
        let toAdd = [];
        for (let i = 0; i < 10; i++) {
          toAdd.push({ title: 'New game loaded', id: '777' });
        }
        Games = [...Games, ...toAdd];
        loadingMoreGames = false;
      }, 1000);
    }
  }}
  loadingMoreBottom={loadingMoreGames} />
