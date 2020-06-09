<script>
  import Nav from "../components/Nav.svelte";
  import Footer from "../components/Footer.svelte";

  import GetStarted from "../components/GetStartedModal.svelte";
  import Notice from "../components/Notice.svelte";

  import Spinner from "../components/Spinner.svelte";

  export let segment;

  import { stores } from "@sapper/app";
  const { page, preloading } = stores();

  $: {
    if (typeof gtag !== "undefined") {
      const currentPage = $page;

      const fullPath =
        currentPage.path +
        `${Object.keys(currentPage.query).map(
          (k, i) => `${i === 0 ? "?" : "&"}${k}=${currentPage.query[k]}`
        )}`;
      gtag("config", "UA-164657760-1", {
        page_path: fullPath
      });
    }
  }

  import { derived } from "svelte/store";
  const delayedPreloading = derived(preloading, (currentPreloading, set) => {
    setTimeout(() => set(currentPreloading), 250);
  });
</script>

{#if $preloading && $delayedPreloading}
  <div
    class="bottom-0 inset-x-0 px-4 pb-6 inset-0 p-0 items-center justify-center
    z-10 fixed flex">
    <div class="fixed inset-0 transition-opacity z-10">
      <div class="absolute inset-0 bg-gray-500 opacity-50" />
    </div>
    <div class="absolute z-10 mx-auto flex items-center justify-center">
      <Spinner color="rgba(255,255,255,1)" size={100} />
    </div>
  </div>
{/if}

{#if $page.query && $page.query.getstarted === 'true'}
  <GetStarted />
{/if}

{#if $page.query && $page.query.notice}
  <Notice notice={$page.query.notice} />
{/if}

<div class="bg-gray-800 flex flex-col min-h-screen">
  <Nav {segment} />

  <main class="flex-grow">
    <slot />
  </main>

  <Footer />
</div>
