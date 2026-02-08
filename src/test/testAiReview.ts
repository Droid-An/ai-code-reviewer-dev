// this is file for isolated testing. WIP

import { App } from "octokit";
import { env, privateKey } from "../config/env";
import { runAiReview } from "../networks/github";

const app = new App({
  appId: env.APP_ID,
  privateKey: privateKey,
  webhooks: {
    secret: env.WEBHOOK_SECRET,
  },
});

const owner = "Droid-An";
const ownerCYF = "CodeYourFuture";
const repo = "ai-code-reviewer-dev";
const repoCYF = "Module-Data-Flows";
const prNum = 152;

const installationRes = await app.octokit.request(
  "GET /repos/{owner}/{repo}/installation",
  {
    owner,
    repo,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  },
);
const octokit = await app.getInstallationOctokit(installationRes.data.id);

// TEMP: unauthenticated (lower usage limits)
// const octokit = new Octokit();

//Test functions
// runAiReview(ownerCYF, repoCYF, prNum, octokit);
runAiReview(owner, repo, 1, octokit);
