// Initially this get schema was a function. I don't know why so I converted it to variable
export const getSchema = {
  name: "feedback",
  strict: true,
  schema: {
    type: "object",
    properties: {
      feedback_points: {
        type: "array",
        description:
          "A collection of feedback points. Each feedback_point must refer to exactly one issue.",
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
              description:
                "A detailed explanation of the feedback given. All line numbers MUST be placed inside line_ranges and NEVER written inside the description text.",
            },
            questions: {
              type: "string",
              description:
                "Acting as a coach, use questioning to help the trainee understand the feedback.",
            },
            line_ranges: {
              type: "array",
              description:
                "REQUIRED. Exact line number ranges where the issue occurs. ",
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
            severity: {
              type: "integer",
              description:
                "The severity of the feedback. 1 is the lowest severity and 5 is the highest. The severity should be classified as 5=Critical, 4=High, 3=Medium, 2=Low, 1=Informational.",
            },
          },
          required: [
            "file_name",
            "description",
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
