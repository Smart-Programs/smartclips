<script>
  import Nav from "../components/Nav.svelte";
  import Footer from "../components/Footer.svelte";

  import GetStarted from "../components/GetStartedModal.svelte";
  import Notice from "../components/Notice.svelte";

  export let segment;

  import { stores } from "@sapper/app";
  const { page } = stores();

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
</script>

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
