<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import { fade } from "svelte/transition";

  export let hidden = false,
    plan = "Free";
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
            Subscribed to {plan}
          </h3>
          <p>Testing 123</p>
        </div>
      </div>
    </div>
  </div>
{/if}
