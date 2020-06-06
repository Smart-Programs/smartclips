<script>
  import { onMount } from "svelte";
  import Fallback from "./fallback";
  import LoadingElement from "../LoadingGifSquare";

  export let title,
    id,
    itemid = `game-card-none-${Math.random()}`;

  let imageLocation = `https://gameart.mixer.com/art/${id}/cover.jpg?locked`;

  let elem;

  onMount(() => {
    const preview = new Image();
    preview.src = imageLocation;

    preview.onload = () => {
      elem.src = preview.src;
    };

    preview.onerror = () => {
      elem.src = Fallback;
    };
  });
</script>

<style>
  .card-flex-basis {
    flex-basis: 80%;
  }

  @media only screen and (min-width: 768px) {
    .card-flex-basis {
      flex-basis: calc(100% / 3 - 10px * 2);
    }
  }

  @media only screen and (min-width: 1024px) {
    .card-flex-basis {
      flex-basis: calc(100% / 5 - 10px * 2);
    }
  }

  @media only screen and (min-width: 1280px) {
    .card-flex-basis {
      flex-basis: calc(100% / 6 - 10px * 2);
    }
  }
</style>

<div
  class="flex flex-col flex-inverse-auto card-flex-basis rounded bg-gray-900
  shadow m-4 overflow-hidden"
  id={itemid}>
  <div>
    <a href={`/explore/recent/${id}`}>
      <img
        bind:this={elem}
        id={`preview-${id}`}
        class="w-full object-cover"
        src={LoadingElement}
        alt="Creator Preview" />
    </a>
  </div>

  <a
    class="p-4 text-md truncate hover:text-blue-500 text-white"
    href={`/explore/recent/${id}`}>
    {title}
  </a>

  <p class="p-4 text-xs text-gray-200 mt-auto">100 Clips • 10,000 views</p>
</div>
