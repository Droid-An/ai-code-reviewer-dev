import { OpenRouter } from "@openrouter/sdk";
import { env } from "../config/env";
import { PRFile } from "../types/githubTypes";
import { buildPRReviewPrompt } from "../utils/buildPRReviewPrompt";

const openRouter = new OpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
});

export async function askOpenRouter(prompt: string) {
  const completion = await openRouter.chat.send({
    model: "arcee-ai/trinity-large-preview:free",
    stream: false,
    messages: [
      {
        role: "system",
        //TODO: change prompt
        content:
          "You are a senior software engineer doing a pull request review. Be concise, actionable, and point out risks, bugs, and improvements. explain in as little text as possible",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return completion.choices[0]?.message?.content ?? "";
}

export async function runAiReview(
  owner: string,
  repo: string,
  pullNumber: number,
  files: PRFile[],
) {
  const prompt = buildPRReviewPrompt({
    owner,
    repo,
    pullNumber,
    files,
  });
  console.log("--------- PROMPT --------\n", prompt);
  console.log("\n🤖 Sending PR diff to OpenRouter for review...\n");

  const review = await askOpenRouter(prompt);

  console.log("\n================ PR REVIEW ================\n");
  console.log(review);
  console.log("\n==========================================\n");

  return review;
}
