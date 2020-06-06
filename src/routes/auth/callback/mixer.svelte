<script context="module">
  export async function preload({ query }) {
    const { code, state, error } = query;

    if (error) {
      return this.error(500, `Mixer Error: ${error}`);
    } else if (!code) {
      return this.error(401, `No Authorization Code`);
    } else {
      return {
        code,
        state
      };
    }
  }
</script>

<script>
  import Spinner from "../../../components/Spinner.svelte";
  import { stores, goto } from "@sapper/app";
  const { page, session } = stores();

  export let code, state;

  let error = "";
  $: {
    function login() {
      if (code) {
        fetch("auth/mixer", {
          credentials: "include",
          method: "POST",
          body: JSON.stringify({ code, state }),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(r => r.json())
          .then(data => {
            if (!data || !data.user) {
              if (data.type === "error") {
                error = data.message;
              } else {
                error = "Invalid login response";
              }
            } else {
              let returnTo;
              if (
                data.state &&
                data.state.returnTo &&
                data.state.returnTo.match(/http(s?):\/\//)
              ) {
                returnTo = `${data.state.returnTo ? data.state.returnTo : "/"}${
                  data.apiKey
                    ? data.state.returnTo.includes("?")
                      ? "&key=" + data.apiKey
                      : "?key=" + data.apiKey
                    : ""
                }`;
              } else {
                returnTo = `${
                  data.state && data.state.returnTo ? data.state.returnTo : "/"
                }${
                  data.created === true
                    ? data.state.returnTo.includes("?")
                      ? "&getstarted=true"
                      : "?getstarted=true"
                    : ""
                }`;
              }

              session.set({ user: data.user });

              return goto(returnTo);
            }
          })
          .catch(e => {
            error = "Invalid login response";
          });
      } else {
        error = "No OAuth code";
      }
    }

    if (process.browser) login(code, state);
  }
</script>

{#if error !== ''}
  <div class="p-10 text-white text-center">
    <h3 class="text-3xl md:text-6xl">Error Logging In</h3>
    <p>Error: {error}</p>

    <div class="pt-10">
      <a
        class="py-5 px-10 rounded bg-blue-500 hover:bg-blue-600"
        href="/auth/mixer?redirectTo=/">
        Retry
      </a>
    </div>
  </div>
{:else}
  <div class="pt-4 w-full">
    <Spinner size="200" speed="750" color="#FFFFFF" thickness="2" gap="40" />
    <p class="text-center text-white">Logging in...</p>
  </div>
{/if}
