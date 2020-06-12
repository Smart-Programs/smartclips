<script>
  import { fade } from "svelte/transition";

  let hidden = true;

  if (process.browser) {
    if (localStorage.getItem("sp-seen-get-started") === "true") {
      hidden = true;
    } else {
      hidden = false;
    }
  }

  $: {
    if (process.browser) {
      localStorage.setItem("sp-seen-get-started", hidden);
    }
  }
</script>

{#if hidden === false}
  <div
    class="bottom-0 inset-x-0 px-4 pb-6 sm:inset-0 sm:p-0 sm:items-center
    sm:justify-center z-10 fixed sm:flex"
    transition:fade>

    <div
      class="fixed inset-0 transition-opacity"
      on:click={() => (hidden = true)}>
      <div class="absolute inset-0 bg-gray-500 opacity-50" />
    </div>

    <div
      class="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl
      transform transition-all sm:max-w-lg sm:w-full sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline">
      <div>
        <div
          class="mx-auto flex items-center justify-center h-12 w-12 rounded-full
          bg-green-100">
          <svg
            class="h-6 w-6 text-green-600"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div class="mt-3 text-center sm:mt-5">
          <h3
            class="text-lg leading-6 font-medium text-gray-900"
            id="modal-headline">
            Account creation successful
          </h3>
          <div class="mt-2">
            <p class="text-sm leading-5 text-gray-500">
              Welcome to SmartClips, thank you for creating an account!
            </p>
            <p class="text-sm leading-5 text-gray-500">
              If you ever have any questions feel free to reach out to us at
              <a class="text-blue-500" href="mailto:support@smartprograms.co">
                support@smartprograms.co
              </a>
              or by joining our discord at
              <a class="text-blue-500" href="discord" target="_blank">
                {process.env.BASE_URL}/discord
              </a>
              We are here to help you!
            </p>
          </div>
        </div>
      </div>
      <div
        class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3
        sm:grid-flow-row-dense">
        <span class="flex w-full rounded-md shadow-sm sm:col-start-2">
          <a
            type="button"
            href="settings"
            class="inline-flex justify-center w-full rounded-md border
            border-transparent px-4 py-2 bg-blue-500 text-base leading-6
            font-medium text-white shadow-sm hover:bg-blue-600
            focus:outline-none focus:border-blue-700 focus:shadow-outline-blue
            transition ease-in-out duration-150 sm:text-sm sm:leading-5">
            Start Setup
          </a>
        </span>
        <span
          class="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:col-start-1">
          <a
            type="button"
            href="pricing"
            class="inline-flex justify-center w-full rounded-md border
            border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium
            text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none
            focus:border-blue-300 focus:shadow-outline-blue transition
            ease-in-out duration-150 sm:text-sm sm:leading-5">
            Pricing
          </a>
        </span>
      </div>
    </div>
  </div>
{/if}
