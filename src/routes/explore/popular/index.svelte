<script>
  import Card from "../../../components/clips/card.svelte";

  import VerticalSection from "../../../components/sections/VerticalSection.svelte";

  let ClipItems = [];

  ClipItems.push({
    title:
      "Hey there! This is a test clip! To see what happens because I like to know that kind of thing!",
    id: "95810118/5PCFZd",
    username: "OfficerStealth",
    platform: "Mixer"
  });

  for (let i = 0; i < 10; i++) {
    ClipItems.push({
      title: "Hey there!",
      id: "95810118/5PCFZd",
      username: "OfficerStealth",
      platform: "Mixer"
    });
  }

  let loadingMoreClips = false;
</script>

<svelte:head>
  <title>SmartClips | Explore what is popular on Mixer</title>

  <meta property="og:site_name" content="SmartClips" />
  <meta
    property="og:title"
    content="SmartClips | Explore what is popular on Mixer" />
  <meta property="og:description" content="See what's popular on Mixer" />

  <meta property="og:url" content={`${process.env.BASE_URL}/explore/recent`} />
  <meta property="og:type" content="website" />
</svelte:head>

<div class="pt-12 px-4 sm:px-6 lg:px-8 lg:pt-20">
  <div class="text-center">
    <h1
      class="mt- text-3xl leading-9 font-extrabold text-white sm:text-4xl
      sm:leading-10 lg:text-5xl lg:leading-none">
      Explore what's popular!
    </h1>
    <h2
      class="mt-3 max-w-4xl mx-auto text-xl leading-7 text-gray-300 sm:mt-5
      sm:text-2xl sm:leading-8">
      See what's popular on Mixer.
    </h2>
  </div>
</div>

<VerticalSection
  {Card}
  items={ClipItems}
  reachedEnd={() => {
    if (ClipItems.length < 50) {
      loadingMoreClips = true;
      setTimeout(() => {
        let toAdd = [];
        for (let i = 0; i < 10; i++) {
          toAdd.push({
            title: 'Hey there! This got added now!',
            id: '95810118/5PCFZd',
            username: 'OfficerStealth',
            platform: 'Mixer'
          });
        }
        ClipItems = [...ClipItems, ...toAdd];
        loadingMoreClips = false;
      }, 1000);
    }
  }}
  loadingMoreBottom={loadingMoreClips} />
