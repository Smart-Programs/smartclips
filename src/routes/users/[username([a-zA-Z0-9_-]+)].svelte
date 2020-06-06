<script context="module">
  export async function preload(page, { user }) {
    const username = page.params.username;

    try {
      const response = await this.fetch(`api/v1/users/${username}`);
      const data = await response.json();

      if (response.status !== 200)
        this.error(response.status, data.message || "Could not get user.");

      const userid = data.Items[0].id;

      if (!userid) throw new Error("Could not find user.");

      const responseClips = await this.fetch(
        `api/v1/users/${userid}/clips?includeSocials`
      );
      const dataClips = await responseClips.json();

      if (responseClips.status !== 200)
        this.error(
          responseClips.status,
          dataClips.message || "Could not get users clips."
        );

      const user = dataClips.Items.find(item => item.type === "Account");
      const Socials = dataClips.Items.find(item => item.type === "Socials");

      if (!user) throw new Error("Could not find user.");

      const clips = dataClips.Items.filter(
        item => item.type === "Clip" && item.status === "SUCCESS"
      ).map(item => {
        return {
          title: item.meta.title,
          platform: item.meta.platform,
          id: `${item.account}/${item.id}`,
          username: user.name,
          createdAt: item.meta.createdAt
        };
      });

      return Promise.resolve({
        userid,
        username: user.name,
        clips,
        page: dataClips.Page,
        socials: Socials ? Socials.Items : undefined
      });
    } catch (error) {
      this.error(500, "Could not get user.");
    }
  }
</script>

<script>
  import Page from "../../components/user/page.svelte";

  export let username, clips, page, userid, socials;
</script>

<Page {...{ username, clips, page, userid, socials }} />
