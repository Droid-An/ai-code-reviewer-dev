import { Octokit } from "octokit";
import { askOpenRouter } from "./ai_api_request";
import { buildPRReviewPrompt } from "../utils/buildPRReviewPrompt";
import { postPRComment } from "./postPrComment";
import type { PRFile } from "../types/githubTypes";

/**
 * Function to get code from the PR
 */
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

export async function runAiReview(
  owner: string,
  repo: string,
  pullNumber: number,
  octokit: Octokit,
) {
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

  return review;
}
