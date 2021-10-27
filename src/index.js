const core = require("@actions/core");
const { Octokit } = require("octokit");
const Axios = require("axios");

try {
  const auth = core.getInput("personal_access_token");
  const sep = core.getInput("seperator") || "|";
  const username = core.getInput("username");
  const password = core.getInput("password");

  const kit = new Octokit({ auth });

  // USES A PRIVATE API. MAY CHANGE AT ANY MOMENT
  async function fetchToken() {
    const {
      data: { device },
    } = await Axios.post("https://api.poopmap.net/api/v1/devices");

    await Axios.post(
      "https://api.poopmap.net/api/v1/sessions",
      {
        user: { username, password },
      },
      {
        headers: { Authorization: `Token token=${device.token}` },
      }
    );

    const {
      data: { url },
    } = await Axios.post(
      "https://api.poopmap.net/api/v1/public_links",
      {},
      {
        headers: { Authorization: `Token token=${device.token}` },
      }
    );

    const token = url.split("=").pop();
    return token;
  }

  // only fetches from the last 24 hours
  async function fetchPoops(token) {
    const {
      data: { poops },
    } = await Axios.get(`https://api.poopmap.net/api/v1/public_links/${token}`);

    const poopsFromLast24Hours = poops.filter((poop) => {
      const createdAt = new Date(poop.created_at);
      const now = new Date().getTime();
      const oneDayAgo = now - 1 * 24 * 60 * 60 * 1000;

      poop.created_at = createdAt.toString();

      return createdAt.getTime() > oneDayAgo;
    });

    return poopsFromLast24Hours;
  }

  fetchToken().then((token) => {
    fetchPoops(token).then(async ({ length }) => {
      core.setOutput(length);

      const user = await kit.rest.users.getAuthenticated();
      await kit.request("PATCH /user", {
        bio: `${user.data.bio.split(sep)[0].trim()} ${sep} ${length} poop${length > 1 ? "s" : ""} 💩 in the last day`,
      });
    });
  });
} catch (err) {
  core.setFailed(err);
}
