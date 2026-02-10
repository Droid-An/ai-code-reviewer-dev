// Initially this get schema was a function. I don't know why so I converted it to variable
export const getSchema = {
  name: "feedback",
  strict: true,
  schema: {
    type: "object",
    properties: {
      feedback_points: {
        type: "array",
        description: "A collection of feedback points.",
        items: {
          type: "object",
          properties: {
            file_name: {
              type: "string",
              description: "The name of the file where the feedback applies.",
            },
            summary: {
              type: "string",
              description:
                "A very short summary of the problem, explained in the context of a beginner coder, without using any of the words in the title.",
            },
            description: {
              type: "string",
              description: "A detailed explanation of the feedback given.",
            },
            questions: {
              type: "string",
              description:
                "Acting as a coach, use questioning to help the trainee understand the feedback.",
            },
            line_ranges: {
              type: "array",
              description:
                "Exact line ranges from the provided line-numbered diff where the issue occurs. Never leave empty unless the feedback applies to the entire file.",
              items: {
                type: "object",
                properties: {
                  start: { type: "integer" },
                  end: { type: "integer" },
                },
                required: ["start", "end"],
                additionalProperties: false,
              },
            },
            code_example: {
              type: "string",
              description:
                "A code example providing a solution or illustration related to the feedback.",
            },
            severity: {
              type: "integer",
              description:
                "The severity of the feedback. 1 is the lowest severity and 5 is the highest. The severity should be classified as 5=Critical, 4=High, 3=Medium, 2=Low, 1=Informational.",
            },
          },
          required: [
            "file_name",
            "description",
            "code_example",
            "questions",
            "line_ranges",
            "summary",
            "severity",
          ],
          additionalProperties: false,
        },
      },
    },
    required: ["feedback_points"],
    additionalProperties: false,
  },
};
