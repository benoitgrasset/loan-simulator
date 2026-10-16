import axe from "axe-core";

function formatViolations(violations: axe.Result[]): string {
  return violations
    .map((violation) => {
      const nodes = violation.nodes
        .map((node) => `  ${node.html}\n  ${node.failureSummary}`)
        .join("\n");
      return `${violation.id} (${violation.impact}): ${violation.help}\n${nodes}`;
    })
    .join("\n\n");
}

/** Scans a rendered subtree and fails with a readable a11y report. */
export async function assertNoA11yViolations(
  context: axe.ElementContext = document,
): Promise<void> {
  const results = await axe.run(context);
  if (results.violations.length) {
    throw new Error(
      `Accessibility issues found\n\n${formatViolations(results.violations)}`,
    );
  }
}
