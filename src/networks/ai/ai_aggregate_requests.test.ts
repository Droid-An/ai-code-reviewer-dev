const aiReviewWithDuplicate = [
  {
    feedback_type: "Return true or false",
    feedback_points: [],
  },
  {
    feedback_type: "Variables scope",
    feedback_points: [
      {
        file_name: "implement-shell-tools/ls/ls.js",
        topics: [
          "Variables whose lexical scope is too broad, too narrow, shadowed, leaked, or causes closure bugs",
        ],
        point:
          "In `main`, the `directories` variable is initialised once and then reassigned inside the `args.forEach` callback. Because `directories` is in the outer function scope and you always overwrite it with a single-element array when you see a non-flag argument, the effective meaning becomes “use only the last non-flag argument as the directory”. Given the kata requirements (supporting `ls -1`, `ls -1 sample-files`, and `ls -1 -a sample-files` from a specific directory), this still behaves correctly in those cases, but it relies on `directories` being mutable across the whole function.\n\nIt might be interesting to ask yourself: is the scope and mutability of `directories` the simplest way to express the behaviour you need here? For example, if later you wanted to reason about or change how arguments are parsed, would it be easier if you treated `directories` as something you build once from the arguments, rather than something you keep reassigning from inside a callback? Exploring that question can help you decide when a broader, mutable scope is helpful versus when a narrower or more local scope would make the code easier to reason about.",
        line_numbers: ["27-36"],
        severity: 3,
      },
    ],
  },
  {
    feedback_type: "Temporary variables",
    feedback_points: [],
  },
  {
    feedback_type: "Bad naming",
    feedback_points: [
      {
        file_name: "implement-shell-tools/ls/ls.js",
        topics: [
          "Bad naming that deceives the reader about what variable stores or function logic",
        ],
        point:
          "In `main`, the `directories` variable name suggests that the program supports listing multiple directories at once, but the logic always replaces its contents with a single-element array when a non-flag argument is seen. This can give a reader the impression that the code handles many directories, when in reality only the last path argument will be used. How might you pick a name that more clearly reflects that only one directory (the last one provided) is actually being stored and used?",
        line_numbers: ["27-36"],
        severity: 3,
      },
    ],
  },
  {
    feedback_type: "Duplications",
    feedback_points: [
      {
        file_name: "implement-shell-tools/cat/cat.js",
        topics: [
          "Duplicated code which can be moved into functions so they can be referenced from multiple places",
        ],
        point:
          'In your `cat` function, the logic for printing a numbered line is effectively duplicated in the `if (options.numberNonEmpty && line.trim())` branch and in the `else if (options.numberLines)` branch. Both branches build the same string with `lineNumber` and `line`, then increment `lineNumber`. When the only difference between branches is the condition that decides *whether* to number, it can be a hint that there might be a cleaner way to structure this so the numbering logic itself only appears once. How might you separate "deciding if this line should be numbered" from "actually printing a numbered line" so that the increment and formatting live in just one place?',
        line_numbers: ["16-23"],
        severity: 4,
      },
    ],
  },
  {
    feedback_type: "Deep nesting",
    feedback_points: [],
  },
];
