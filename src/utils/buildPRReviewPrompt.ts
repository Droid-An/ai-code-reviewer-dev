import type { PRFile } from "../types/githubTypes";

export function buildPRReviewPrompt(params: {
  owner: string;
  repo: string;
  pullNumber: number;
  files: PRFile[];
}) {
  const { owner, repo, pullNumber, files } = params;

  const filesText = files
    .map((f) => {
      return `### File: ${f.filename} (${f.status})
\`\`\`diff
${f.patch ?? "NO_PATCH_AVAILABLE"}
\`\`\`
`;
    })
    .join("\n");

  return `
Review this GitHub Pull Request.

Repo: ${owner}/${repo}
PR: #${pullNumber}

Changed files:
${filesText}
`;
}

// Instructions:
// - Identify bugs, edge cases, security issues, and performance issues.
// - Suggest improvements and best practices.
// - If a patch is missing, mention what additional context is needed.
// - Provide a final summary + checklist.
