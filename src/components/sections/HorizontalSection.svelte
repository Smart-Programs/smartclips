<script>
  export let Card, items, link, title;
</script>

<div class="p-10 w-full">
  <div class="flex justify-between text-white items-center">
    <h3 class="font-bold text-3xl">{title}</h3>
    <a
      class="px-3 text-blue-500 hover:text-blue-600 text-2xl font-bold"
      href={link}>
      View all
    </a>
  </div>

  <div class="flex flex-row flex-no-wrap overflow-x-auto py-3">

    {#each items as item}
      <svelte:component this={Card} {...item} />
    {/each}

    <a
      href={link}
      class="flex flex-inverse-auto justify-center items-center w-11/12
      md:w-7/12 lg:w-5/12 xl:w-3/12 m-2 p-5 rounded-lg bg-gray-900">
      <p class="text-white text-xl font-bold">View More</p>
    </a>
  </div>
</div>
