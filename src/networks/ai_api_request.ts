import { OpenRouter } from "@openrouter/sdk";
import { env } from "../config/env";

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
          "You are a senior software engineer doing a pull request review. Be concise, actionable, and point out risks, bugs, and improvements.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return completion.choices[0]?.message?.content ?? "";
}
