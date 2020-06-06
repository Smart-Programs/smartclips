<script>
  import Full from "./logos/Full.svelte";
  import Small from "./logos/Small.svelte";

  import LoginModal from "./LoginModal.svelte";

  import { slide, fade } from "svelte/transition";

  import { stores } from "@sapper/app";
  const { session } = stores();

  export let segment;

  let shouldOpen = false;
  let width = 0;

  $: isMobile = width <= 627 ? true : false;
  $: mobileMenuOpen = shouldOpen === true && isMobile === true;

  let profileOpen = false;

  const logout = async () => {
    try {
      const res = await fetch("/auth/logout", {
        credentials: "include",
        method: "POST"
      });

      const body = await res.json();

      session.set({ user: body.user });
    } catch (error) {
      // give error to user
    }
  };

  let viewLogin = false;
</script>

{#if viewLogin === true}
  <LoginModal
    {segment}
    onHide={() => {
      viewLogin = false;
    }} />
{/if}

<svelte:window
  on:click={() => {
    profileOpen = false;
    shouldOpen = false;
  }} />

<nav bind:clientWidth={width} class="bg-gray-900">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <a aria-label="Home" href="." rel="prefetch">
            <div class="block lg:hidden h-8 w-auto">
              <Small />
            </div>
          </a>
          <a aria-label="Home" href="." rel="prefetch">
            <div class="hidden lg:block h-8 w-auto">
              <Full />
            </div>
          </a>
        </div>
        <div class="hidden sm:block sm:ml-6">
          <div class="flex">
            <a
              href="/explore"
              rel="prefetch"
              class={`ml-4 px-3 py-2 rounded-md text-sm font-medium leading-5
              text-gray-300 hover:text-white hover:bg-gray-700
              focus:outline-none focus:text-white focus:bg-gray-700 transition
              duration-150 ease-in-out ${segment === 'explore' ? 'bg-gray-900' : ''}`}>
              Explore
            </a>
            <a
              href="/pricing"
              rel="prefetch"
              class={`ml-4 px-3 py-2 rounded-md text-sm font-medium leading-5
              text-gray-300 hover:text-white hover:bg-gray-700
              focus:outline-none focus:text-white focus:bg-gray-700 transition
              duration-150 ease-in-out ${segment === 'pricing' ? 'bg-gray-900' : ''}`}>
              Pricing
            </a>
            {#if process.env.NODE_ENV !== 'production'}
              <a
                target="_blank"
                href="https://gitlab.com/smartprograms/smartclips/-/merge_requests/new?merge_request%5Bsource_branch%5D=dev"
                class={`ml-4 px-3 py-2 rounded-md text-sm font-medium leading-5
              text-gray-300 hover:text-white hover:bg-gray-700
              focus:outline-none focus:text-white focus:bg-gray-700 transition
              duration-150 ease-in-out`}>
                Merge
              </a>
            {/if}
          </div>
        </div>
      </div>
      <div class="hidden sm:ml-6 sm:block">
        <div class="flex items-center">
          {#if $session.user}
            <div class="ml-3 relative">
              <div>
                <button
                  on:click={event => {
                    event.stopPropagation();
                    profileOpen = !profileOpen;
                  }}
                  class="flex text-sm border-2 border-transparent rounded-full
                  focus:outline-none focus:border-white transition duration-150
                  ease-in-out"
                  aria-label="Your Account">
                  <img
                    class="h-8 w-8 rounded-full"
                    src={$session.user.avatar || '/sp.jpg'}
                    alt="Profile" />
                </button>
              </div>

              {#if profileOpen}
                <div
                  transition:slide
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md
                  shadow-lg z-50">
                  <div class="py-1 rounded-md bg-white shadow-xs">
                    <a
                      href={`/users/${$session.user.account}`}
                      rel="prefetch"
                      class="block px-4 py-2 text-sm leading-5 text-gray-700
                      hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                      transition duration-150 ease-in-out">
                      Profile
                    </a>
                    <a
                      href="/settings"
                      rel="prefetch"
                      class="block px-4 py-2 text-sm leading-5 text-gray-700
                      hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                      transition duration-150 ease-in-out">
                      Settings
                    </a>
                    <a
                      href={`/${segment || ''}`}
                      on:click={logout}
                      class="block px-4 py-2 text-sm leading-5 text-gray-700
                      hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                      transition duration-150 ease-in-out">
                      Sign out
                    </a>
                  </div>
                </div>
              {/if}
            </div>
          {:else}
            <button
              on:click={() => {
                viewLogin = true;
              }}
              class="ml-4 px-3 py-2 rounded-md text-sm font-medium leading-5
              text-gray-100 hover:text-white hover:bg-gray-700
              focus:outline-none focus:text-white focus:bg-gray-700 transition
              duration-150 ease-in-out">
              Login
            </button>
            <a
              href="/pricing"
              rel="prefetch"
              class="ml-4 px-3 py-2 rounded-md text-sm font-medium leading-5
              text-white bg-blue-500 hover:bg-blue-600 focus:outline-none
              focus:bg-blue-700 transition duration-150 ease-in-out">
              Get Started
            </a>
          {/if}
        </div>
      </div>
      {#if isMobile === true}
        <div class="-mr-2 flex sm:hidden">
          <button
            on:click={event => {
              event.stopPropagation();
              shouldOpen = !shouldOpen;
            }}
            class="inline-flex items-center justify-center p-2 rounded-md
            text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none
            focus:bg-gray-700 focus:text-white transition duration-150
            ease-in-out"
            aria-label="Open Mobile Menu">
            {#if mobileMenuOpen === false}
              <svg
                class="block h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            {:else}
              <svg
                class="block h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            {/if}

          </button>
        </div>
      {/if}
    </div>
  </div>

  {#if mobileMenuOpen === true}
    <div transition:slide>
      <div class="px-2 pt-2 pb-3">
        <a
          href="/explore"
          rel="prefetch"
          class={`mt-1 block px-3 py-2 rounded-md text-base font-medium
          text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none
          focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out ${segment === 'explore' ? 'bg-gray-900' : ''}`}>
          Explore
        </a>
        <a
          href="/pricing"
          rel="prefetch"
          class={`mt-1 block px-3 py-2 rounded-md text-base font-medium
          text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none
          focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out ${segment === 'pricing' ? 'bg-gray-900' : ''}`}>
          Pricing
        </a>
      </div>
      <div class="pt-4 pb-3 border-t border-gray-700">
        {#if $session.user}
          <div class="flex items-center px-5">
            <div class="flex-shrink-0">
              <img
                class="h-10 w-10 rounded-full"
                src={$session.user.avatar || '/sp.jpg'}
                alt="Profile"
                loading="lazy" />
            </div>
            <div class="ml-3">
              <div class="text-base font-medium leading-6 text-white">
                {$session.user.username || 'Username'}
              </div>
              <div class="text-sm font-medium leading-5 text-gray-400">
                {$session.user.email || 'Email'}
              </div>
            </div>
          </div>
        {/if}
        <div class="mt-3 px-2">
          {#if $session.user}
            <a
              href={`/users/${$session.user.account}`}
              rel="prefetch"
              class="block px-3 py-2 rounded-md text-base font-medium
              text-gray-400 hover:text-white hover:bg-gray-700
              focus:outline-none focus:text-white focus:bg-gray-700 transition
              duration-150 ease-in-out">
              Profile
            </a>
            <a
              href={`/settings`}
              rel="prefetch"
              class="block px-3 py-2 rounded-md text-base font-medium
              text-gray-400 hover:text-white hover:bg-gray-700
              focus:outline-none focus:text-white focus:bg-gray-700 transition
              duration-150 ease-in-out">
              Settings
            </a>
            <a
              href={`/${segment || ''}`}
              on:click={logout}
              class="block px-3 py-2 rounded-md text-base font-medium
              text-gray-400 hover:text-white hover:bg-gray-700
              focus:outline-none focus:text-white focus:bg-gray-700 transition
              duration-150 ease-in-out">
              Sign out
            </a>
          {:else}
            <button
              on:click={() => {
                viewLogin = true;
              }}
              class="block w-full text-left px-3 py-2 rounded-md text-base
              font-medium text-gray-400 hover:text-white hover:bg-gray-700
              focus:outline-none focus:text-white focus:bg-gray-700 transition
              duration-150 ease-in-out">
              Login
            </button>
            <a
              href="/pricing"
              rel="prefetch"
              class="mt-1 block px-3 py-2 rounded-md text-base font-medium
              text-white bg-blue-500 hover:bg-blue-700 focus:outline-none
              focus:bg-blue-700 transition duration-150 ease-in-out">
              Get Started
            </a>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</nav>
