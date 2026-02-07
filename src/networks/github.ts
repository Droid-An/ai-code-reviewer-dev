import { App, Octokit } from "octokit";
import { askOpenRouter } from "./ai_api_request";
import { buildPRReviewPrompt } from "./buildPRReviewPrompt";
import { postPRComment } from "./postPrComment";
import { env, privateKey } from "../config/env";
import type { PRFile } from "../types/githubTypes";

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

async function getPRFiles(
  owner: string,
  repo: string,
  pullNumber: number,
  octokit: Octokit,
): Promise<PRFile[]> {
  const res = await octokit.request(
    `GET /repos/${owner}/${repo}/pulls/${pullNumber}/files`,
    { per_page: 100 },
  );

  return res.data;
}
/**
 * Function to get code from the PR
 */
export async function runAiReview(
  owner: string,
  repo: string,
  pullNumber: number,
  octokit: Octokit,
) {
  // 1. Parse URL
  console.log("\n📦 PR Info:", { owner, repo, pullNumber });

  const files = await getPRFiles(owner, repo, pullNumber, octokit);
  console.log(`\n📂 Changed files (${files.length}):`);

  console.log("\nResponse ----------------------------------");
  console.log(`\n📂 Changed files (${JSON.stringify(files, null, 4)}):`);

  for (const file of files) {
    console.log("\n----------------------------------");
    console.log("File:", file.filename);

    if (file.patch) {
      console.log("Patch:\n", file.patch);
    } else {
      console.log("⚠️ No patch available");
    }
  }

  const prompt = buildPRReviewPrompt({
    owner,
    repo,
    pullNumber,
    files,
  });

  console.log("\n🤖 Sending PR diff to OpenRouter for review...\n");

  const review = await askOpenRouter(prompt);

  console.log("\n================ PR REVIEW ================\n");
  console.log(review);
  console.log("\n==========================================\n");

  await postPRComment({
    owner,
    repo,
    pullNumber,
    body: `## 🤖 AI PR Review\n\n${review}`,
    octokit,
  });

  return review;
}
//Test functions
// run(ownerCYF, repoCYF, prNum, octokit);
// runAiReview(owner, repo, 1, octokit);
