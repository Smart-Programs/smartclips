<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import { fade } from "svelte/transition";

  export let hidden = false;
</script>

{#if hidden === false}
  <div
    class="bottom-0 inset-x-0 px-4 pb-6 sm:inset-0 sm:p-0 sm:items-center
    sm:justify-center z-10 fixed sm:flex"
    transition:fade>

    <div
      class="fixed inset-0 transition-opacity"
      on:click={() => dispatch('hide')}>
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
          bg-red-100">
          <svg
            class="h-6 w-6 text-red-600"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24">
            <line x1="0" y1="0" x2="24" y2="24" style="stroke-width:5" />
            <line x1="24" y1="0" x2="0" y2="24" style="stroke-width:5" />
          </svg>
        </div>
        <div class="mt-3 text-center sm:mt-5">
          <h3
            class="text-lg leading-6 font-medium text-gray-900"
            id="modal-headline">
            Delete Account
          </h3>
          <div class="mt-2">
            <p class="text-sm leading-5 text-gray-500">
              Deleting accounts is not yet supported. If you would like to
              delete your account contact us at
              <a class="text-blue-500" href="mailto:support@smartprograms.co">
                support@smartprograms.co.
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
