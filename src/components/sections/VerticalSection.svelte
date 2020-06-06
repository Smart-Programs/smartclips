<script>
  import Spinner from "../Spinner.svelte";
  export let Card,
    title = "",
    items = [],
    reachedEnd = () => {},
    reachedTop = () => {},
    loadingMoreBottom = false,
    unobserveTop = false,
    unobserveBottom = true,
    showTitle = true;

  let lastLength = 0;

  $: {
    if (process.browser && items.length !== lastLength) {
      lastLength = items.length;
      initObserver();
    }
  }

  let lastElem,
    observer,
    hitFirstTop = false;

  const initObserver = () => {
    const options = {};

    const callback = entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (items.length === 1) {
            if (!hitFirstTop) {
              hitFirstTop = true;
            } else {
              if (unobserveTop)
                observer.unobserve(document.querySelector(`#${title}-item-0`));
              reachedTop();
            }
            if (unobserveBottom)
              observer.unobserve(
                document.querySelector(`#${title}-item-${items.length - 1}`)
              );
            reachedEnd();
          } else {
            if (entry.target.id === `${title}-item-0`) {
              if (!hitFirstTop) {
                hitFirstTop = true;
              } else {
                if (unobserveTop)
                  observer.unobserve(
                    document.querySelector(`#${title}-item-0`)
                  );
                reachedTop();
              }
            } else if (
              entry.target.id === `${title}-item-${items.length - 1}`
            ) {
              if (unobserveBottom)
                observer.unobserve(
                  document.querySelector(`#${title}-item-${items.length - 1}`)
                );
              reachedEnd();
            }
          }
        }
      });
    };

    if (!observer) observer = new IntersectionObserver(callback, options);

    setTimeout(() => {
      hitFirstTop = false;
      observer.disconnect();

      observer.observe(document.querySelector(`#${title}-item-0`));
      observer.observe(
        document.querySelector(`#${title}-item-${items.length - 1}`)
      );
    });
  };
</script>

<div class="mb-20 p-10 w-full" id={title}>
  {#if showTitle}
    <div class="flex justify-between text-white items-center">
      <h3 class="font-bold text-3xl">{title}</h3>
    </div>
  {/if}

  <div class="flex flex-wrap justify-around items-center py-3">
    {#each items as item, index}
      <svelte:component
        this={Card}
        {...item}
        itemid={`${title}-item-${index}`} />
    {/each}
  </div>

  {#if loadingMoreBottom === true}
    <div class="py-20">
      <Spinner size={100} color="rgb(255,255,255)" />
    </div>
  {/if}
</div>
