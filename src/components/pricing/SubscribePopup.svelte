<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import { fade } from "svelte/transition";
  import Spinner from "../Spinner.svelte";

  export let hidden = false,
    plan = "none",
    token;

  $: console.log({ hidden });

  function importJS(url, onload) {
    const js = document.createElement("script");
    js.src = url;
    js.async = true;
    js.onload = onload;

    document.body && document.body.appendChild(js);
  }

  let container = null,
    braintree;
  async function braintreeLoaded(braintreeData) {
    braintree = braintreeData;

    console.log({ container });
    if (!container) return;

    container.innerHTML = "";
  }

  $: {
    if (process.browser && !braintree && hidden === false) {
      importJS(
        "https://js.braintreegateway.com/web/dropin/1.21.0/js/dropin.min.js",
        () => {
          braintreeLoaded(window.braintree);
        }
      );
    }
  }

  let braintreeError = null,
    instance = null,
    allowPayButton = false;
  $: {
    if (plan && braintree) {
      braintree.dropin
        .create({
          authorization: token,
          container: "#dropin-container",
          paypal: {
            flow: "vault",
            intent: "authorize",
            amount: "499",
            currency: "USD",
            landingPageType: "login"
          },
          vaultManager: true
        })
        .then(data => {
          instance = data;
          console.log("Loaded");
        })
        .catch(error => {
          console.error(error);
          braintreeError = "Failed to load payment form.";
        });
    }
  }

  let details = null;

  async function getPlanDetails(name) {
    try {
      console.log({ run: "getPlanDetails", name });
      details = null;

      const response = await fetch(`/api/v1/plans/${name}`);
      const data = await response.json();

      if (response.status !== 200 || data.type === "error") {
        let message = "Error: Unexpected Error";

        if (
          data.code &&
          data.context_info &&
          data.context_info.errors &&
          data.context_info.errors.length > 0
        )
          message = `${data.code}: ${data.context_info.errors[0].message}`;

        return Promise.reject(new Error(message));
      } else {
        details = data;
        return Promise.resolve(data);
      }
    } catch (error) {
      return Promise.reject(new Error("Error: Unexpected Error"));
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
            Subscribe - {plan}
          </h3>
          {#if process.browser}
            {#await getPlanDetails(plan)}
              <div class="mt-2">
                <Spinner size={40} color="black" />
              </div>
            {:then value}
              <div class="mt-2">
                <p class="text-sm leading-5 text-gray-500">
                  We loaded the plan {value.name}.
                </p>
              </div>
            {:catch error}
              <div class="mt-2">
                <p class="text-sm leading-5 text-gray-500">
                  Oops, we could not load the plan {plan}, please try again
                  later.
                </p>
                <p class="text-sm leading-5 text-red-500">{error.message}</p>
              </div>
            {/await}
          {:else}
            <div class="mt-2">
              <Spinner size={40} color="black" />
            </div>
          {/if}

          {#if braintreeError}
            <p>{braintreeError}</p>
          {/if}
          <div
            class="mt-6"
            bind:this={container}
            id="dropin-container"
            hidden={details === null} />
          <button
            class={`block w-full text-center rounded-lg border border-transparent 
            ${allowPayButton ? 'bg-blue-600 hover:bg-blue-500 focus:border-blue-700' : 'bg-black'} px-6 py-4 mt-10 
            text-xl leading-6 font-medium text-white focus:outline-none focus:shadow-outline-blue 
            transition ease-in-out duration-150`}
            disabled={allowPayButton}>
            {allowPayButton ? 'Subscribe $4.99' : 'Select Payment'}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
