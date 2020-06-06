<script context="module">
  export function preload(page, { user }) {
    if (!user) return { subscription: null };

    return new Promise((resolve, reject) => {
      this.fetch(`api/v1/users/current/subscription`, {
        credentials: "include"
      })
        .then(data => {
          if (data.status === 401) throw new Error("Status 401");
          else return data.json();
        })
        .then(({ subscription, token }) => resolve({ subscription, token }))
        .catch(err => {
          if (err.message === "Status 401") {
            resolve({ subscription: null, user: "delete" });
          } else {
            resolve({ subscription: null });
          }
        });
    });
  }
</script>

<script>
  import Feature from "../components/pricing/feature.svelte";
  import SubscribePopup from "../components/pricing/SubscribePopup.svelte";
  import { stores, goto } from "@sapper/app";
  const { session } = stores();

  export let subscription,
    token,
    user = "";

  $: {
    if (process.browser && user === "delete") session.set({ user: null });
  }

  let showSubPopup = false,
    selectedPlan = "";
</script>

<svelte:head>
  <title>SmartClips | Pick the perfect plan for your streaming needs</title>

  <meta property="og:site_name" content="SmartClips" />
  <meta
    property="og:title"
    content="SmartClips | Pick the perfect plan for your streaming needs" />
  <meta
    property="og:description"
    content="Plans designed with you and your stream in mind. Pick the perfect
    plan that suites your needs." />

  <meta property="og:url" content="https://smartclips.app/pricing" />
  <meta property="og:type" content="website" />
</svelte:head>

{#if $session.user && token && selectedPlan}
  <SubscribePopup
    on:hide={() => (showSubPopup = false)}
    hidden={!showSubPopup}
    {token}
    {subscription}
    plan={selectedPlan} />
{/if}

<div>
  <div class="pt-12 px-4 sm:px-6 lg:px-8 lg:pt-20">
    <div class="text-center">
      <p
        class="mt- text-3xl leading-9 font-extrabold text-white sm:text-4xl
        sm:leading-10 lg:text-5xl lg:leading-none">
        The right price for you, whoever you are
      </p>
      <p
        class="mt-3 max-w-4xl mx-auto text-xl leading-7 text-gray-300 sm:mt-5
        sm:text-2xl sm:leading-8">
        Create a clip. Share a clip. Download a clip. Whatever you need, we got
        you.
      </p>
    </div>
  </div>

  <div class="mt-16 bg-gray-800 pb-12 lg:mt-20 lg:pb-20">
    <div class="relative z-0">
      <div class="absolute inset-0 h-5/6 bg-gray-800 lg:h-2/3" />
      <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative lg:grid lg:grid-cols-7">
          <div
            class="mx-auto max-w-md lg:mx-0 lg:max-w-none lg:col-start-1
            lg:col-end-3 lg:row-start-2 lg:row-end-3">
            <div
              class="h-full flex flex-col rounded-lg shadow-lg overflow-hidden
              lg:rounded-none lg:rounded-l-lg">
              <div class="flex-1 flex flex-col">
                <div class="bg-white px-6 py-10">
                  <div>
                    <h2
                      class="text-center text-2xl leading-8 font-medium
                      text-gray-900">
                      Starter
                    </h2>
                    <div class="mt-4 flex items-center justify-center">
                      <span
                        class="px-3 flex items-start text-6xl leading-none
                        tracking-tight text-gray-900">
                        <span class="mt-2 mr-2 text-4xl font-medium">$</span>
                        <span class="font-extrabold">0</span>
                      </span>
                      <span class="text-xl leading-7 font-medium text-gray-400">
                        /forever
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  class="flex-1 flex flex-col justify-between border-t-2
                  border-gray-100 p-6 bg-gray-50 sm:p-10 lg:p-6 xl:p-10">
                  <p class="text-center">
                    Perfect for those just getting started streaming.
                  </p>
                  <ul>
                    <li class="mt-2">
                      <p class="text-gray-600">Limits:</p>
                    </li>
                    <Feature feature={'Storage 7 days'} />
                    <Feature feature={'Storage 50 clips'} />
                    <Feature feature={'Create 10 clips /day'} />
                    <Feature feature={'Maximum 30s clips'} />

                    <li class="mt-6">
                      <p class="text-gray-600">Features:</p>
                    </li>
                    <Feature feature={'User page'} />
                    <Feature feature={'Easy download'} />
                  </ul>
                  <div class="mt-8">
                    <div class="rounded-lg shadow-md">
                      {#if $session.user && subscription}
                        <a
                          href="."
                          class="block w-full text-center rounded-lg border
                          border-transparent bg-white px-6 py-3 text-base
                          leading-6 font-medium text-blue-600
                          hover:text-blue-500 focus:outline-none
                          focus:shadow-outline transition ease-in-out
                          duration-150">
                          Downgrade
                        </a>
                      {:else if $session.user && !subscription}
                        <a
                          href="settings"
                          class="block w-full text-center rounded-lg border
                          border-transparent bg-white px-6 py-3 text-base
                          leading-6 font-medium text-blue-600
                          hover:text-blue-500 focus:outline-none
                          focus:shadow-outline transition ease-in-out
                          duration-150">
                          Current Plan
                        </a>
                      {:else}
                        <a
                          href="/auth/mixer"
                          class="block w-full text-center rounded-lg border
                          border-transparent bg-white px-6 py-3 text-base
                          leading-6 font-medium text-blue-600
                          hover:text-blue-500 focus:outline-none
                          focus:shadow-outline transition ease-in-out
                          duration-150">
                          Create your account
                        </a>
                      {/if}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="mt-10 max-w-lg mx-auto lg:mt-0 lg:max-w-none lg:mx-0
            lg:col-start-3 lg:col-end-6 lg:row-start-1 lg:row-end-4">
            <div class="relative z-10 rounded-lg shadow-xl">
              <div
                class="pointer-events-none absolute inset-0 rounded-lg border-2
                border-blue-600" />
              <div class="absolute inset-x-0 top-0 transform translate-y-px">
                <div class="flex justify-center transform -translate-y-1/2">
                  <span
                    class="inline-flex rounded-full bg-blue-600 px-4 py-1
                    text-sm leading-5 font-semibold tracking-wider uppercase
                    text-white">
                    Most popular
                  </span>
                </div>
              </div>
              <div class="bg-white rounded-t-lg px-6 pt-12 pb-10">
                <div>
                  <h2
                    class="text-center text-3xl leading-9 font-semibold
                    text-gray-900 sm:-mx-6">
                    Upcoming
                  </h2>
                  <div class="mt-4 flex items-center justify-center">
                    <span
                      class="px-3 flex items-start text-6xl leading-none
                      tracking-tight text-gray-900 sm:text-6xl">
                      <span class="mt-2 mr-2 text-4xl font-medium">$</span>
                      <span class="font-extrabold">3.99</span>
                    </span>
                    <span class="text-2xl leading-8 font-medium text-gray-400">
                      /month
                    </span>
                  </div>
                </div>
              </div>
              <div
                class="border-t-2 border-gray-100 rounded-b-lg pt-10 pb-8 px-6
                bg-gray-50 sm:px-10 sm:py-10">
                <p class="pb-2 text-center">
                  Perfect for those getting past the starting stage of streaming
                  and one step closer to becoming a professional.
                </p>
                <ul>
                  <li class="mt-2">
                    <p class="text-gray-600">Limits:</p>
                  </li>
                  <Feature feature={'Storage 30 days'} />
                  <Feature feature={'Storage 500 clips'} />
                  <Feature feature={'Create 50 clips /day'} />
                  <Feature feature={'Maximum 60s clips'} />

                  <li class="mt-6">
                    <p class="text-gray-600">All of Starter plus:</p>
                  </li>
                  <Feature feature={'Simple analytics'} />
                  <Feature feature={'Clips listed in explore'} />
                  <Feature feature={'Shortened Clip URLs'} />
                  <Feature feature={'Easy share (soon)'} />
                </ul>
                <div class="mt-10">
                  <div class="rounded-lg shadow-md">
                    {#if $session.user && subscription && subscription.name === 'Upcoming'}
                      <a
                        href="settings"
                        class="block w-full text-center rounded-lg border
                        border-transparent bg-blue-600 px-6 py-4 text-xl
                        leading-6 font-medium text-white hover:bg-blue-500
                        focus:outline-none focus:border-blue-700
                        focus:shadow-outline-blue transition ease-in-out
                        duration-150">
                        Current Plan
                      </a>
                    {:else if $session.user && subscription}
                      <a
                        href="."
                        class="block w-full text-center rounded-lg border
                        border-transparent bg-blue-600 px-6 py-4 text-xl
                        leading-6 font-medium text-white hover:bg-blue-500
                        focus:outline-none focus:border-blue-700
                        focus:shadow-outline-blue transition ease-in-out
                        duration-150">
                        Downgrade
                      </a>
                    {:else if $session.user && token}
                      <button
                        on:click={() => {
                          selectedPlan = 'Upcoming';
                          showSubPopup = true;
                        }}
                        class="block w-full text-center rounded-lg border
                        border-transparent bg-blue-600 px-6 py-4 text-xl
                        leading-6 font-medium text-white hover:bg-blue-500
                        focus:outline-none focus:border-blue-700
                        focus:shadow-outline-blue transition ease-in-out
                        duration-150">
                        Upgrade
                      </button>
                    {:else if !$session.user}
                      <a
                        href="/auth/mixer?returnTo=/pricing"
                        class="block w-full text-center rounded-lg border
                        border-transparent bg-blue-600 px-6 py-4 text-xl
                        leading-6 font-medium text-white hover:bg-blue-500
                        focus:outline-none focus:border-blue-700
                        focus:shadow-outline-blue transition ease-in-out
                        duration-150">
                        Subscribe
                      </a>
                    {:else}
                      <a
                        href="/auth/mixer?returnTo=/pricing"
                        class="block w-full text-center rounded-lg border
                        border-transparent bg-blue-600 px-6 py-4 text-xl
                        leading-6 font-medium text-white hover:bg-blue-500
                        focus:outline-none focus:border-blue-700
                        focus:shadow-outline-blue transition ease-in-out
                        duration-150">
                        Error loading
                      </a>
                    {/if}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="mt-10 mx-auto max-w-md lg:m-0 lg:max-w-none lg:col-start-6
            lg:col-end-8 lg:row-start-2 lg:row-end-3">
            <div
              class="h-full flex flex-col rounded-lg shadow-lg overflow-hidden
              lg:rounded-none lg:rounded-r-lg">
              <div class="flex-1 flex flex-col">
                <div class="bg-white px-6 py-10">
                  <div>
                    <h2
                      class="text-center text-2xl leading-8 font-medium
                      text-gray-900">
                      Professional
                    </h2>
                    <div class="mt-4 flex items-center justify-center">
                      <span
                        class="px-3 flex items-start text-6xl leading-none
                        tracking-tight text-gray-900">
                        <span class="mt-2 mr-2 text-4xl font-medium">$</span>
                        <span class="font-extrabold">7.99</span>
                      </span>
                      <span class="text-xl leading-7 font-medium text-gray-400">
                        /month
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  class="flex-1 flex flex-col justify-between border-t-2
                  border-gray-100 p-6 bg-gray-50 sm:p-10 lg:p-6 xl:p-10">
                  <p class="text-center">
                    Perfect for the professional streamers who need the most.
                  </p>
                  <ul>
                    <li class="mt-2">
                      <p class="text-gray-600">Limits:</p>
                    </li>
                    <Feature feature={'Storage 30 days'} />
                    <Feature feature={'Storage 1000 clips'} />
                    <Feature feature={'Create 100 clips /day'} />
                    <Feature feature={'Maximum 90s clips'} />

                    <li class="mt-5">
                      <p class="text-gray-600">All of Upcoming plus:</p>
                    </li>
                    <Feature feature={'Auto backup (soon)'} />
                    <Feature feature={'Advanced analytics (soon)'} />
                    <Feature feature={'Mass download (soon)'} />
                  </ul>
                  <div class="mt-8">
                    <div class="rounded-lg shadow-md">

                      {#if $session.user && subscription && subscription.name === 'Professional'}
                        <a
                          href="settings"
                          class="block w-full text-center rounded-lg border
                          border-transparent bg-white px-6 py-3 text-base
                          leading-6 font-medium text-blue-600
                          hover:text-blue-500 focus:outline-none
                          focus:shadow-outline transition ease-in-out
                          duration-150">
                          Current Plan
                        </a>
                      {:else if $session.user && token}
                        <button
                          on:click={() => {
                            selectedPlan = 'Professional';
                            showSubPopup = true;
                          }}
                          class="block w-full text-center rounded-lg border
                          border-transparent bg-white px-6 py-3 text-base
                          leading-6 font-medium text-blue-600
                          hover:text-blue-500 focus:outline-none
                          focus:shadow-outline transition ease-in-out
                          duration-150">
                          Upgrade
                        </button>
                      {:else if !$session.user}
                        <a
                          href="/auth/mixer?returnTo=/pricing"
                          class="block w-full text-center rounded-lg border
                          border-transparent bg-white px-6 py-3 text-base
                          leading-6 font-medium text-blue-600
                          hover:text-blue-500 focus:outline-none
                          focus:shadow-outline transition ease-in-out
                          duration-150">
                          Subscribe
                        </a>
                      {:else}
                        <a
                          href="/auth/mixer?returnTo=/pricing"
                          class="block w-full text-center rounded-lg border
                          border-transparent bg-blue-600 px-6 py-4 text-xl
                          leading-6 font-medium text-white hover:bg-blue-500
                          focus:outline-none focus:border-blue-700
                          focus:shadow-outline-blue transition ease-in-out
                          duration-150">
                          Error loading
                        </a>
                      {/if}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
