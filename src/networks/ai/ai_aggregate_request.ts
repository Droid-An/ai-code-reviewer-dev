import { ChatGenerationParams, Message } from "@openrouter/sdk/models";
import { aggregationPrompt } from "./prompt.js";
import { MODEL } from "./ai_api_request.js";
import { env } from "../../config/env.js";
import { OpenRouter } from "@openrouter/sdk";
import {
  AiResponse,
  FeedbackPoint,
  Deduplication,
  DeduplicationSchema,
} from "../../types/aiResponse.js";
import { deduplicationSchema } from "../../utils/responseSchemas/getSchema.js";

const openRouter = new OpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
});

async function aiCall(
  params: Partial<ChatGenerationParams>,
  messages: Message[],
): Promise<string> {
  try {
    const completion = await openRouter.chat.send({
      // TODO: make sure params and messages are valid
      ...params,
      messages,
      stream: false,
    });
    const res = completion.choices[0]?.message?.content;
    if (!res) {
      throw new Error("No content returned from OpenRouter");
    }
    if (typeof res !== "string") {
      throw new Error("Content returned from OpenRouter is not string");
    }
    return res;
  } catch (e) {
    console.log("error occurred when sending request to OpenRouter");
    return "";
  }
}

export async function aggregateFeedback(
  aiReview: AiResponse[],
): Promise<AiResponse[]> {
  //we need indexes to accurately identify points
  const indexedReviews = indexFeedbackPoints(aiReview);

  const groupingMessage: Message[] = [
    {
      role: "system",
      content: aggregationPrompt,
    },
    {
      role: "user",
      //   open router accept only string in content field
      content: feedbackArrayToString(indexedReviews),
    },
  ];
  const params: Partial<ChatGenerationParams> = {
    temperature: 0,
    model: MODEL,
    responseFormat: {
      type: "json_schema",
      jsonSchema: deduplicationSchema,
    },
  };
  const response = await aiCall(params, groupingMessage);
  const arrayOfIdsToRemove: Deduplication = DeduplicationSchema.parse(
    JSON.parse(response),
  );
  const deduplicatedReview = indexedReviews.map((review) => ({
    ...review,
    feedback_points: review.feedback_points.filter(
      (point) => !arrayOfIdsToRemove.deduplicate.includes(point.id),
    ),
  }));
  return deduplicatedReview.map((review) => ({
    ...review,
    feedback_points: review.feedback_points.map(({ id, ...rest }) => rest),
  }));
}

const feedbackArrayToString = (aiReview) => {
  const convertFeedbackPointToString = (
    feedback_point: FeedbackPoint,
  ): string => {
    const stringOutput: string[] = [];
    for (const [key, value] of Object.entries(feedback_point)) {
      stringOutput.push(`${key}:${value}`);
    }
    return stringOutput.join("\n");
  };
  const stringFeedback = aiReview
    .map((review) => review.feedback_points.map(convertFeedbackPointToString))
    .join("\n\n");
  return stringFeedback;
};

const indexFeedbackPoints = (aiReview: AiResponse[]) => {
  let id = 0;
  if (!aiReview) return;
  const listOfPoints = aiReview.map((review) => ({
    ...review,
    feedback_points: review.feedback_points.map((point) => ({
      id: id++,
      ...point,
    })),
  }));
  return listOfPoints;
};
