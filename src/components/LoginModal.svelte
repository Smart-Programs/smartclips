<script>
  import { fade } from "svelte/transition";

  let hidden = false;

  export let segment, onHide;
</script>

{#if hidden === false}
  <div
    class="top-0 inset-x-0 px-4 pt-6 z-10 fixed sm:inset-0 sm:p-0
    sm:items-center sm:justify-center sm:flex"
    transition:fade>

    <div
      class="fixed inset-0 transition-opacity"
      on:click={() => {
        if (hidden === false) {
          hidden = true;
          setTimeout(() => onHide(true), 500);
        }
      }}>
      <div class="absolute inset-0 bg-gray-500 opacity-50" />
    </div>

    <div
      class="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl
      transform transition-all sm:max-w-lg sm:w-full sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline">
      <div class="mt-3 text-center sm:mt-5">
        <h3
          class="text-lg leading-6 font-medium text-gray-900"
          id="modal-headline">
          Login to SmartClips
        </h3>
      </div>
      <div class="mt-5 sm:mt-6">
        <span class="flex w-full items-center rounded-md shadow-sm">
          <a
            href={`/auth/mixer?returnTo=/${segment || ''}`}
            type="button"
            class="inline-flex justify-center w-full rounded-md border
            border-transparent px-4 py-2 bg-blue-500 text-base leading-6
            font-medium text-white shadow-sm hover:bg-blue-400
            focus:outline-none focus:border-blue-600 focus:shadow-outline-blue
            transition ease-in-out duration-150 sm:text-sm sm:leading-5">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 512 512"
              style="width: 24px;"
              xml:space="preserve">
              <style type="text/css">
                .mix0 {
                  fill: #000;
                }
                .mix1 {
                  fill: #000;
                }
              </style>
              <path
                class="mix0"
                d="M116.03,77.68c-15.76-21.29-46.72-24.61-66.91-6.36c-17.42,16.04-18.8,43.13-4.7,62.21l90.96,121.92
                L43.87,378.48c-14.1,19.08-12.99,46.17,4.7,62.21c20.18,18.25,51.15,14.93,66.91-6.36l127.73-171.69c3.04-4.15,3.04-9.95,0-14.1
                L116.03,77.68z" />
              <path
                class="mix1"
                d="M396.37,77.68c15.76-21.29,46.72-24.61,66.91-6.36c17.42,16.04,18.8,43.13,4.7,62.21l-90.96,121.92
                l91.51,123.03c14.1,19.08,12.99,46.17-4.7,62.21c-20.18,18.25-51.15,14.93-66.91-6.36L269.47,262.36c-3.04-4.15-3.04-9.95,0-14.1
                L396.37,77.68z" />
            </svg>
            <span class="ml-3">Login With Mixer</span>
          </a>
        </span>
      </div>

      <div>
        <div class="mt-10 text-center">
          <p class="text-sm leading-5 text-gray-500">
            By logging in you agree to our
            <a class="text-blue-500" href="legal/terms">terms of service,</a>
            and our
            <a class="text-blue-500" href="legal/privacy">privacy policy.</a>
          </p>
        </div>
      </div>
    </div>
  </div>
{/if}
