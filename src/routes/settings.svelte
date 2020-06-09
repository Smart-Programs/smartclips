<script context="module">
  export async function preload(page, { user }) {
    if (!user) return this.redirect(302, "/");

    try {
      const response = await this.fetch(`api/v1/users/current/subscription`, {
        credentials: "include"
      });

      if (response.status === 401) return Promise.resolve({ user: "delete" });

      return Promise.resolve({}); // temporary until subscriptions are setup

      // const data = await response.json();

      // if (response.status !== 200)
      //   return this.error(
      //     response.status,
      //     data.message || "Internal Server Error"
      //   );

      // return Promise.resolve(data);
    } catch (error) {
      console.error(error);
      return this.error(500, "Could not get user.");
    }
  }
</script>

<script>
  import DeleteAccountModal from "../components/DeleteAccountModal.svelte";
  import CancelPlanModal from "../components/CancelPlanModal.svelte";
  import SubscriptionDetailsModal from "../components/SubscriptionDetailsModal.svelte";

  import { stores, goto } from "@sapper/app";
  const { session } = stores();

  export let subscription = null,
    // plan,
    // meta,
    // token,
    user = "";

  $: {
    if (process.browser && user === "delete") {
      session.set({ user: null });

      goto("/")
        .then()
        .catch(console.error);
    }
  }

  let showDeleteAccount = false,
    showCancelPlan = false,
    showSubDetails;
</script>

<svelte:head>
  <title>SmartClips | Settings</title>
</svelte:head>

{#if $session.user}
  <DeleteAccountModal
    on:hide={() => {
      showDeleteAccount = false;
    }}
    hidden={!showDeleteAccount} />
  <CancelPlanModal
    on:hide={() => {
      showCancelPlan = false;
    }}
    hidden={!showCancelPlan} />

  <SubscriptionDetailsModal
    on:hide={() => {
      showSubDetails = false;
    }}
    hidden={!showSubDetails} />

  <div class="w-4/5 mx-auto pb-16">
    <div class="bg-gray-900 px-4 py-5 mt-10 border-b border-black sm:px-6">
      <div
        class="-ml-4 -mt-4 flex justify-between items-center flex-wrap
        sm:flex-no-wrap">
        <div class="ml-4 mt-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <img
                class="h-12 w-12 rounded-full"
                src={$session.user.avatar}
                alt="" />
            </div>
            <div class="ml-4">
              <h3 class="text-lg leading-6 font-medium text-white">
                {$session.user.username}
              </h3>
              <p class="text-sm leading-5 text-gray-200">
                <a href={`/users/${$session.user.account}`}>
                  {$session.user.username}#{$session.user.hash || '0'}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-gray-850 px-4 py-5 sm:px-6">
      <dl class="grid grid-cols-1 col-gap-4 row-gap-8 sm:grid-cols-2">
        <div class="sm:col-span-1">
          <dt class="text-sm leading-5 font-medium text-white">
            Email address
          </dt>
          <dd class="mt-1 text-sm leading-5 text-gray-200">
            {$session.user.email}
          </dd>
        </div>
        <div class="sm:col-span-2">
          <dt class="text-sm leading-5 font-medium text-white">About</dt>
          <dd class="mt-1 text-sm leading-5 text-gray-200">
            {$session.user.bio}
          </dd>
        </div>
        <div class="sm:col-span-2">
          <dt class="text-sm leading-5 font-medium text-white">
            Social Connections
          </dt>
          <dd class="mt-1 text-sm leading-5 text-gray-200">
            <ul class="border border-gray-500 rounded-md">
              <li
                class="pl-3 pr-4 py-3 flex items-center justify-between text-sm
                leading-5">
                <div class="w-0 flex-1 flex items-center">
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 512 512"
                    style="width: 24px;"
                    xml:space="preserve">
                    <style type="text/css">
                      .st0 {
                        fill: #fff;
                      }
                      .st1 {
                        fill: #1fbaed;
                      }
                    </style>
                    <path
                      class="st0"
                      d="M116.03,77.68c-15.76-21.29-46.72-24.61-66.91-6.36c-17.42,16.04-18.8,43.13-4.7,62.21l90.96,121.92
                      L43.87,378.48c-14.1,19.08-12.99,46.17,4.7,62.21c20.18,18.25,51.15,14.93,66.91-6.36l127.73-171.69c3.04-4.15,3.04-9.95,0-14.1
                      L116.03,77.68z" />
                    <path
                      class="st1"
                      d="M396.37,77.68c15.76-21.29,46.72-24.61,66.91-6.36c17.42,16.04,18.8,43.13,4.7,62.21l-90.96,121.92
                      l91.51,123.03c14.1,19.08,12.99,46.17-4.7,62.21c-20.18,18.25-51.15,14.93-66.91-6.36L269.47,262.36c-3.04-4.15-3.04-9.95,0-14.1
                      L396.37,77.68z" />
                  </svg>
                  <span class="ml-2 flex-1 w-0 truncate">
                    {$session.user.username} (Primary)
                  </span>
                </div>
                <div class="ml-4 flex-shrink-0">
                  <button
                    class="font-medium text-blue-500 hover:text-blue-600
                    transition duration-150 ease-in-out">
                    Disconnect
                  </button>
                </div>
              </li>
            </ul>
          </dd>
        </div>
        <div class="sm:col-span-2">
          <dt class="text-sm leading-5 font-medium text-white">Commands</dt>
          <dd class="mt-1 text-sm leading-5 text-gray-200">
            <ul class="border border-gray-500 rounded-md">
              <li
                class="pl-3 pr-4 py-3 flex items-center justify-between text-sm
                leading-5">
                <div class="w-0 flex-1 flex items-center">
                  <svg
                    height="24"
                    width="24"
                    version="1.1"
                    viewBox="0 0 612 512">
                    <path
                      d="m81.293 45.392s-57.143 206.43 0 418.57c32.143-55
                      52.143-87.857
                      52.143-87.857-5-20.714-30.714-112.86.71428-239.29-26.429-46.429-52.857-91.429-52.857-91.429z"
                      fill-rule="evenodd"
                      fill="#FFFFFF" />
                    <path
                      d="m96.293 42.534s145 52.143 254.29
                      202.86c-26.429-22.143-87.857-80.714-205-115.71-36.429-64.286-49.286-87.143-49.286-87.143z"
                      fill-rule="evenodd"
                      class="darker"
                      fill="#b3b3b3" />
                    <path
                      d="m96.913 468.69s145-52.143 254.29-202.86c-26.429
                      22.143-87.857 80.714-205 115.71-36.429 64.286-49.286
                      87.143-49.286 87.143z"
                      fill-rule="evenodd"
                      class="darker"
                      fill="#b3b3b3" />
                    <path
                      d="m357.87 246.45s-92.934-142.43-262.64-208.09c57.08
                      17.169 211.77 59.886 363.2
                      210.6-77.143-.71429-100.56-2.5126-100.56-2.5126z"
                      fill-rule="evenodd"
                      fill="#FFFFFF" />
                    <path
                      d="m357.79 265.8s-92.934 142.43-262.64
                      208.09c57.074-17.173 211.77-59.89
                      363.2-210.6-77.143.71429-100.56 2.5126-100.56 2.5126z"
                      fill-rule="evenodd"
                      fill="#FFFFFF" />
                  </svg>
                  <span class="ml-2 flex-1 w-0 truncate">BeepBot</span>
                </div>
                <div class="ml-4 flex-shrink-0">
                  <button
                    class="font-medium text-blue-500 hover:text-blue-600
                    transition duration-150 ease-in-out">
                    Connect
                  </button>
                </div>
              </li>
              <li
                class="border-t border-gray-500 pl-3 pr-4 py-3 flex items-center
                justify-between text-sm leading-5">
                <div class="w-0 flex-1 flex items-center">
                  <img src="/miu-logo.png" alt="MIU" width="24" />
                  <span class="ml-2 flex-1 w-0 truncate">MixItUp</span>
                </div>
                <div class="ml-4 flex-shrink-0">
                  <a
                    href="/api/v1/users/current/miu"
                    download
                    class="font-medium text-blue-500 hover:text-blue-600
                    transition duration-150 ease-in-out">
                    Download
                  </a>
                </div>
              </li>
            </ul>
          </dd>
        </div>

        <div class="sm:col-span-2">
          <dt class="text-sm leading-5 font-medium text-white">Plan</dt>
          <dd class="mt-1 text-sm leading-5 text-gray-200">
            <ul class="border border-gray-500 rounded-md">
              <li
                class="pl-3 pr-4 py-3 flex items-center justify-between text-sm
                leading-5">
                <div class="w-0 flex-1 flex items-center">
                  <svg
                    height="24px"
                    viewBox="0 0 1298 1202"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    xml:space="preserve"
                    xmlns:serif="http://www.serif.com/"
                    style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
                    <g transform="matrix(1,0,0,1,0,-3)">
                      <g transform="matrix(4.16667,0,0,4.16667,0,0)">
                        <path
                          d="M0,133.709L0,114.283C31.064,108.69 30.158,76.679
                          29.893,52.682C29.817,43.27 29.78,33.596
                          31.934,24.411C34.769,12.394 42.856,6.574
                          54.269,3.173C65.078,-0.078 78.38,0.942
                          89.68,0.942L225.467,0.942C235.708,0.942 247.31,0.187
                          257.174,3.173C268.588,6.574 276.674,12.394
                          279.509,24.411C281.663,33.596 281.626,43.27
                          281.551,52.682C281.285,76.679 280.379,108.69
                          311.444,114.283L311.444,133.709C303.28,135.295
                          295.949,138.962 290.658,145.954C271.8,170.746
                          291.036,207.027 275.389,232.575C264.922,249.62
                          240.168,246.785
                          223.2,246.785L90.134,246.785C72.787,246.785
                          46.824,250.073 36.053,232.575C27.021,217.797
                          30.12,197.729 29.591,180.913C28.91,159.786
                          24.186,138.357 0,133.709Z"
                          style="fill:rgb(21,189,233);" />
                        <path
                          d="M283.439,161.525C277.96,184.426 287.975,211.977
                          275.389,232.575C264.922,249.62 240.168,246.785
                          223.2,246.785L130.61,246.785L85.333,169.914L227.205,81.743L283.439,161.525Z"
                          style="fill:rgb(9,85,154);" />
                        <path
                          d="M156.233,42.25C202.338,42.25 239.715,79.628
                          239.715,125.734C239.715,171.841 202.338,209.256
                          156.233,209.256C110.127,209.256 72.712,171.841
                          72.712,125.734C72.712,79.628 110.127,42.25
                          156.233,42.25Z"
                          style="fill:white;" />
                        <path
                          d="M202.717,134.426L172.181,152.076L141.001,170.066C130.571,176.075
                          126.906,173.844
                          126.906,161.221L126.906,125.923L126.906,89.944C126.906,77.889
                          130.684,75.847
                          141.607,82.159L172.181,99.809L203.358,117.798C213.79,123.806
                          213.675,128.115 202.717,134.426Z"
                          style="fill:rgb(88,89,91);" />
                        <path
                          d="M233.176,167.646C243.455,174.714 252.904,185.069
                          260.689,194.744C268.663,204.646 276.221,215.53
                          282.571,226.603C284.762,230.459 287.03,234.615
                          288.692,238.773C290.771,243.989 291.905,250.414
                          286.312,254.118L233.743,289L229.209,286.429C217.985,280.08
                          206.798,273.353 195.914,266.474C189.074,262.129
                          182.158,257.633 175.696,252.795C171.348,249.544
                          164.622,244.443 162.618,239.265C159.482,231.213
                          162.771,217.232 164.961,209.068C166.928,201.925
                          171.009,188.621 175.43,182.726C177.206,180.345
                          179.587,178.871
                          182.385,178.002L157.782,156.121C149.318,149.695
                          146.293,138.433 153.246,129.476C159.785,121.087
                          171.046,119.725
                          179.511,125.847L179.663,125.923L233.176,167.646Z"
                          style="fill:white;" />
                        <path
                          d="M228.15,174.487L174.561,132.726C174.561,132.726
                          166.172,126.717 159.973,134.691C153.738,142.703
                          163.147,149.505
                          163.147,149.505L208.725,190.096C208.725,190.096
                          186.92,181.592 182.233,187.828C177.585,194.064
                          166.966,226.906 170.555,236.203C174.145,245.501
                          233.365,279.023
                          233.365,279.023L281.588,247.049C285.481,244.443
                          254.604,192.59 228.15,174.487Z"
                          style="fill:rgb(88,89,91);" />
                      </g>
                    </g>
                  </svg>
                  <span class="ml-2 flex-1 w-0 truncate">
                    {subscription && subscription.name !== 'Free' ? `${subscription.name} ($3.99/month) | Renews ${new Date().toDateString()}` : 'Free'}
                  </span>
                </div>

                <div class="ml-4 flex-shrink-0">
                  <button
                    on:click={() => (showSubDetails = true)}
                    class="font-medium text-blue-500 hover:text-blue-600
                    transition duration-150 ease-in-out">
                    Details
                  </button>
                </div>

                {#if subscription}
                  <div class="ml-4 flex-shrink-0">
                    <button
                      on:click={() => (showCancelPlan = true)}
                      class="font-medium text-red-500 hover:text-red-600
                      transition duration-150 ease-in-out">
                      Cancel
                    </button>
                  </div>
                {:else}
                  <div class="ml-4 flex-shrink-0">
                    <button
                      on:click={() => (showDeleteAccount = true)}
                      class="font-medium text-red-500 hover:text-red-600
                      transition duration-150 ease-in-out">
                      Delete Account
                    </button>
                  </div>
                {/if}
              </li>
            </ul>
          </dd>
        </div>
      </dl>
    </div>
  </div>
{/if}
