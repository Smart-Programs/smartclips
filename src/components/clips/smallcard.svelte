<script>
  import { onMount } from "svelte";
  import Fallback from "./fallback";
  import LoadingElement from "../LoadingGif.js";
  import formatDistance from "date-fns/formatDistance";

  export let title,
    id,
    username,
    platform,
    itemid = `small-clip-card-none-${Math.random()}`,
    createdAt = Date.now();

  $: shortName =
    username.length > 20 ? `${username.substring(0, 17)}...` : username;

  let imageLocation = `process.env.S3_FILES_URL/${id}.jpg`;

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
    flex-basis: 75%;
  }

  @media only screen and (min-width: 768px) {
    .card-flex-basis {
      flex-basis: calc(100% / 2 - 10px * 2);
    }
  }

  @media only screen and (min-width: 1024px) {
    .card-flex-basis {
      flex-basis: calc(100% / 3 - 10px * 2);
    }
  }

  @media only screen and (min-width: 1280px) {
    .card-flex-basis {
      flex-basis: calc(100% / 4 - 10px * 2);
    }
  }
</style>

<div
  class="flex flex-col flex-inverse-auto card-flex-basis rounded bg-gray-900
  shadow m-2 overflow-hidden"
  id={itemid}>
  <div>
    <a href={`/clips/${id}`}>
      <img
        bind:this={elem}
        id={`preview-${id}`}
        class="w-full object-cover"
        src={LoadingElement}
        alt="Clip Preview" />
    </a>
  </div>

  <a
    class="p-4 text-md truncate hover:text-blue-500 text-white"
    href={`/clips/${id}`}>
    {title}
  </a>

  <p class="p-4 text-xs text-gray-200 mt-auto">
    <a href={`/users/${username}`} class="hover:underline hover:text-blue-500">
      {shortName} on {platform}
    </a>
    • {formatDistance(createdAt, new Date(), { addSuffix: true })}
  </p>
</div>
