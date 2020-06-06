<script>
  import Quote from "../components/Quote.svelte";

  import { stores } from "@sapper/app";
  const { session } = stores();
</script>

<svelte:head>
  <title>
    SmartClips | The best clipping service for making clips on Mixer
  </title>

  <meta property="og:site_name" content="SmartClips" />
  <meta
    property="og:title"
    content="SmartClips | The best clipping service for making and sharing clips
    on Mixer." />
  <meta
    property="og:description"
    content="The best clipping service to easily make clips on Mixer. Fully
    designed for streamers, focused on speed, user experience, and reliability." />

  <meta property="og:url" content="https://smartclips.app" />
  <meta property="og:type" content="website" />
</svelte:head>

<!-- HERO -->

<div class="relative overflow-hidden pt-12 pb-24">
  <div class="hidden sm:block sm:absolute sm:inset-y-0 sm:h-full sm:w-full">
    <div class="relative h-full max-w-screen-xl mx-auto">
      <svg
        class="absolute right-full transform translate-y-1/4 translate-x-1/4
        lg:translate-x-1/2 lg:-translate-y-3/4"
        width="404"
        height="784"
        fill="none"
        viewBox="0 0 404 784">
        <defs>
          <pattern
            id="f210dbf6-a58d-4871-961e-36d5016a0f49"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse">
            <rect
              x="0"
              y="0"
              width="4"
              height="4"
              class="text-gray-400"
              fill="currentColor" />
          </pattern>
        </defs>
        <rect
          width="404"
          height="784"
          fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
      </svg>
      <svg
        class="absolute left-full transform -translate-y-3/4 -translate-x-1/4
        lg:-translate-x-1/2 lg:translate-y-1/3"
        width="404"
        height="784"
        fill="none"
        viewBox="0 0 404 784">
        <defs>
          <pattern
            id="5d0dd344-b041-4d26-bec4-8d33ea57ec9b"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse">
            <rect
              x="0"
              y="0"
              width="4"
              height="4"
              class="text-gray-400"
              fill="currentColor" />
          </pattern>
        </defs>
        <rect
          width="404"
          height="784"
          fill="url(#5d0dd344-b041-4d26-bec4-8d33ea57ec9b)" />
      </svg>
    </div>
  </div>

  <div class="relative pt-6 pb-12 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
    <div
      class="mt-10 mx-auto max-w-screen-xl px-4 sm:mt-12 sm:px-6 md:mt-16
      lg:mt-20 xl:mt-28">
      <div class="text-center">
        <h2
          class="text-4xl tracking-tight leading-10 font-extrabold text-white
          sm:text-5xl sm:leading-none md:text-6xl">
          Clips designed for
          <br class="xl:hidden" />
          <span class="text-blue-500">
            {$session.user ? $session.user.username : 'YOU'}
          </span>
        </h2>
        <p
          class="mt-3 max-w-md mx-auto text-base text-gray-100 sm:text-lg
          md:mt-5 md:text-xl md:max-w-3xl">
          SmartClips is the easiest way to create clips on Mixer. Designed with
          the user in mind, and available for everyone to use for free. We focus
          on good user experience, speed, and reliability.
        </p>
        <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          {#if $session.user}
            <div class="rounded-md shadow">
              <a
                href="/pricing"
                class="w-full flex items-center justify-center px-8 py-3 border
                border-transparent text-base leading-6 font-medium rounded-md
                text-white bg-blue-500 hover:bg-blue-600 focus:outline-none
                focus:shadow-outline transition duration-150 ease-in-out md:py-4
                md:text-lg md:px-10">
                Upgrade
              </a>
            </div>
            <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <a
                href="/setup"
                class="w-full flex items-center justify-center px-8 py-3 border
                border-transparent text-base leading-6 font-medium rounded-md
                text-blue-500 bg-white hover:text-blue-600 hover:bg-gray-100
                focus:outline-none focus:shadow-outline focus:border-gray-300
                transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10">
                Setup
              </a>
            </div>
          {:else}
            <div class="rounded-md shadow">
              <a
                href="/pricing"
                class="w-full flex items-center justify-center px-8 py-3 border
                border-transparent text-base leading-6 font-medium rounded-md
                text-white bg-blue-500 hover:bg-blue-600 focus:outline-none
                focus:shadow-outline transition duration-150 ease-in-out md:py-4
                md:text-lg md:px-10">
                Get started
              </a>
            </div>
            <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <a
                href="/explore"
                class="w-full flex items-center justify-center px-8 py-3 border
                border-transparent text-base leading-6 font-medium rounded-md
                text-blue-500 bg-white hover:text-blue-600 hover:bg-gray-100
                focus:outline-none focus:shadow-outline focus:border-gray-300
                transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10">
                Explore
              </a>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<!-- FEATURES -->

<div class="overflow-hidden pt-24">
  <div class="relative max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <svg
      class="absolute top-0 left-full transform -translate-x-1/2
      -translate-y-3/4 lg:left-auto lg:right-full lg:translate-x-2/3
      lg:translate-y-1/4"
      width="404"
      height="784"
      fill="none"
      viewBox="0 0 404 784">
      <defs>
        <pattern
          id="8b1b5f72-e944-4457-af67-0c6d15a99f38"
          x="0"
          y="0"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse">
          <rect
            x="0"
            y="0"
            width="4"
            height="4"
            class="text-gray-400"
            fill="currentColor" />
        </pattern>
      </defs>
      <rect
        width="404"
        height="784"
        fill="url(#8b1b5f72-e944-4457-af67-0c6d15a99f38)" />
    </svg>

    <div class="relative lg:grid lg:grid-cols-3 lg:col-gap-8">
      <div class="lg:col-span-1">
        <h3
          class="text-3xl leading-9 font-extrabold tracking-tight text-white
          sm:text-4xl sm:leading-10">
          The better way to clip.
        </h3>
      </div>
      <div
        class="mt-10 sm:grid sm:grid-cols-2 sm:col-gap-8 sm:row-gap-10
        lg:col-span-2 lg:mt-0">
        <div>
          <div
            class="flex items-center justify-center h-12 w-12 rounded-md
            bg-blue-500 text-white">
            <svg
              class="h-6 w-6"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9
                9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657
                0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <div class="mt-5">
            <h5 class="text-lg leading-6 font-medium text-white">
              Cloud based
            </h5>
            <p class="mt-2 text-base leading-6 text-gray-100">
              SmartClips is cloud based and does all the heavy lifting for you.
              No more worry for storage, or how to share your clips.
            </p>
          </div>
        </div>
        <div class="mt-10 sm:mt-0">
          <div
            class="flex items-center justify-center h-12 w-12 rounded-md
            bg-blue-500 text-white">
            <svg
              class="h-6 w-6"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M21.9692 9.67997C21.8992 9.44997 21.6892 9.28997 21.4492
                9.26997L15.0492 8.71997L12.5492 2.79997C12.3592 2.35997 11.6292
                2.35997 11.4392 2.79997L8.93918 8.71997L2.54918 9.26997C2.30918
                9.28997 2.09918 9.44997 2.02918 9.67997C1.95918 9.90997 2.02918
                10.16 2.20918 10.32L7.05918 14.53L5.60918 20.79C5.55918 21.02
                5.64918 21.27 5.83918 21.41C6.02918 21.55 6.29918 21.56 6.49918
                21.44L11.9992 18.12L17.4992 21.44C17.5992 21.5 17.6992 21.53
                17.8092 21.53C17.9292 21.53 18.0592 21.49 18.1592 21.42C18.3592
                21.28 18.4492 21.03 18.3892 20.8L16.9392 14.54L21.7892
                10.33C21.9792 10.16 22.0392 9.90997 21.9692 9.67997ZM15.8792
                13.86C15.7092 14.01 15.6392 14.23 15.6892 14.45L16.9092
                19.68L12.3192 16.91C12.2192 16.85 12.1192 16.82 12.0092
                16.82C11.8992 16.82 11.7992 16.85 11.6992 16.91L7.09918
                19.67L8.31918 14.44C8.36918 14.22 8.29918 14 8.12918
                13.85L4.06918 10.34L9.40918 9.87997C9.62918 9.85997 9.81918
                9.71997 9.90918 9.51997L11.9992 4.57997L14.0892 9.51997C14.1792
                9.72997 14.3692 9.86997 14.5892 9.87997L19.9292 10.34L15.8792
                13.86Z"
                fill="#ffffff" />

            </svg>
          </div>
          <div class="mt-5">
            <h5 class="text-lg leading-6 font-medium text-white">Quality</h5>
            <p class="mt-2 text-base leading-6 text-gray-100">
              All of your clips are stored at source quality. No more grainy,
              unusable clips. Perfect for sharing.
            </p>
          </div>
        </div>
        <div class="mt-10 sm:mt-0">
          <div
            class="flex items-center justify-center h-12 w-12 rounded-md
            bg-blue-500 text-white">
            <svg
              class="h-6 w-6"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="mt-5">
            <h5 class="text-lg leading-6 font-medium text-white">Instant</h5>
            <p class="mt-2 text-base leading-6 text-gray-100">
              Our clips are created instanly in the cloud. No more waiting for
              clips to process, no more stressing your CPU while streaming.
            </p>
          </div>
        </div>
        <div />
        <div>
          <a
            href="/pricing"
            class="inline-block text-xl px-4 py-2 leading-none border rounded
            text-white border-blue-500 hover:border-transparent
            hover:bg-blue-500 mt-4 md:mt-0">
            {$session.user ? 'Upgrade' : 'Get Started'}
          </a>
        </div>
      </div>
    </div>

  </div>

</div>

<!-- TRUSTED BY -->

<div
  class="max-w-screen-xl mx-auto pt-36 pb-12 px-4 sm:px-6 lg:pt-48 lg:pb-16
  lg:px-8">
  <p
    class="text-center text-base text-3xl leading-6 font-semibold uppercase
    text-white tracking-wider">
    Trusted by leading streamers
  </p>
  <div class="mt-6 lg:mt-8">
    <Quote
      align={'left'}
      image={'https://uploads.mixer.com/avatar/x063skg1-29104798.jpg'}
      name={'Abba'}
      title={'Mixer Partner'}
      quote={'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias molestiae. Numquam corrupti in laborum sed rerum et corporis.'} />

    <Quote
      align={'right'}
      image={'https://uploads.mixer.com/avatar/wzwxp7pm-414744.jpg'}
      name={'LuckyShots'}
      title={'Mixer Partner'}
      quote={'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias molestiae. Numquam corrupti in laborum sed rerum et corporis.'} />

    <Quote
      align={'left'}
      image={'https://uploads.mixer.com/avatar/v0fkxyft-106384260.jpg'}
      name={'OfficerStealth'}
      title={'Mixer Partner'}
      quote={'As a Streamer, I needed a way to record high quality content from my live streams in real-time. SmartClips was the solution and allowed me to perform my job as a content creator so much easier.'} />
  </div>
</div>

<!-- READY CTA -->

{#if $session.user}
  <div
    class="max-w-screen-xl mx-auto text-center pt-12 pb-32 px-4 sm:px-6 lg:pt-16
    lg:pb-32 lg:px-8">
    <h2
      class="text-3xl leading-9 font-extrabold tracking-tight text-white
      sm:text-4xl sm:leading-10">
      Ready to dive in deeper?
      <br />
      Upgrade your plan today.
    </h2>
    <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
      <div class="rounded-md shadow">
        <a
          href="/pricing"
          class="w-full flex items-center justify-center px-8 py-3 border
          border-transparent text-base leading-6 font-medium rounded-md
          text-white bg-blue-500 hover:bg-blue-600 focus:outline-none
          focus:shadow-outline transition duration-150 ease-in-out md:py-4
          md:text-lg md:px-10">
          Upgrade
        </a>
      </div>
      <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
        <a
          href="/setup"
          class="w-full flex items-center justify-center px-8 py-3 border
          border-transparent text-base leading-6 font-medium rounded-md
          text-blue-500 bg-white hover:text-blue-600 hover:bg-gray-100
          focus:outline-none focus:shadow-outline focus:border-gray-300
          transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10">
          Setup
        </a>
      </div>
    </div>
  </div>
{:else}
  <div
    class="max-w-screen-xl mx-auto text-center pt-12 pb-32 px-4 sm:px-6 lg:pt-16
    lg:pb-32 lg:px-8">
    <h2
      class="text-3xl leading-9 font-extrabold tracking-tight text-white
      sm:text-4xl sm:leading-10">
      Ready to dive in?
      <br />
      Start for free today.
    </h2>
    <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
      <div class="rounded-md shadow">
        <a
          href="/pricing"
          class="w-full flex items-center justify-center px-8 py-3 border
          border-transparent text-base leading-6 font-medium rounded-md
          text-white bg-blue-500 hover:bg-blue-600 focus:outline-none
          focus:shadow-outline transition duration-150 ease-in-out md:py-4
          md:text-lg md:px-10">
          Get started
        </a>
      </div>
      <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
        <a
          href="/about"
          class="w-full flex items-center justify-center px-8 py-3 border
          border-transparent text-base leading-6 font-medium rounded-md
          text-blue-500 bg-white hover:text-blue-600 hover:bg-gray-100
          focus:outline-none focus:shadow-outline focus:border-gray-300
          transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10">
          Learn More
        </a>
      </div>
    </div>
  </div>
{/if}
