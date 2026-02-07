import dotenv from "dotenv";
import { App, Octokit } from "octokit";
import { createNodeMiddleware } from "@octokit/webhooks";
import fs from "node:fs";
import express from "express";
import { RequestError } from "@octokit/request-error";
import { runAiReview } from "./networks/github.ts";

dotenv.config();

const path = "/api/webhook";
const port = process.env.PORT || 3000;

const server = express();

const appId = process.env.APP_ID!;
const webhookSecret = process.env.WEBHOOK_SECRET!;
const privateKeyPath = process.env.PRIVATE_KEY_PATH!;

const privateKey = fs.readFileSync(privateKeyPath, "utf8");

const app = new App({
  appId: appId,
  privateKey: privateKey,
  webhooks: {
    secret: webhookSecret,
  },
});

const middleware = createNodeMiddleware(app.webhooks, { path });

server.use(middleware);
server.use(express.json());

const messageForNewPRs =
  "Thanks for opening a new PR! Please follow our contributing guidelines to make your PR easier to review.";

interface HandlePullRequestOpenedArgs {
  octokit: Octokit;
  //I believe this type exist somewhere in octokit, I just haven't found it
  payload: {
    pull_request: {
      number: number;
    };
    repository: {
      name: string;
      owner: {
        login: string;
      };
    };
  };
}

async function handlePullRequestOpened({
  octokit,
  payload,
}: HandlePullRequestOpenedArgs) {
  console.log(
    `Received a pull request event for #${payload.pull_request.number}`,
  );

  try {
    await runAiReview(
      payload.repository.owner.login,
      payload.repository.name,
      payload.pull_request.number,
      octokit,
    );
    await octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        issue_number: payload.pull_request.number,
        body: messageForNewPRs,
        headers: {
          "x-github-api-version": "2022-11-28",
        },
      },
    );
  } catch (error) {
    if (error instanceof RequestError) {
      if (error.response) {
        console.error(
          `Error! Status: ${error.response.status}. Message: ${error.response.data}`,
        );
      }
      console.error(error);
    }
  }
}

app.webhooks.on("pull_request.opened", handlePullRequestOpened);

app.webhooks.onError((error) => {
  if (error.name === "AggregateError") {
    console.error(`Error processing request: ${error.event}`);
  } else {
    console.error(error);
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
