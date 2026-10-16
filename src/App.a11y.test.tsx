import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, vi } from "vitest";
import App from "./App";
import { assertNoA11yViolations } from "./test/assertNoA11yViolations";
import "./index.css";

vi.mock("./components/LoanChart", () => ({
  default: () => <div>Graphiques</div>,
}));

test("la page crédit n’a pas de violation a11y", async () => {
  const { container } = render(<App />);
  await assertNoA11yViolations(container);
});

test("la page investissement n’a pas de violation a11y", async () => {
  const user = userEvent.setup();
  const { container } = render(<App />);

  await user.click(
    screen.getByRole("button", { name: "Investissement Denormandie" }),
  );

  await assertNoA11yViolations(container);
});

test("la popup des frais n’a pas de violation a11y", async () => {
  const user = userEvent.setup();
  const { container } = render(<App />);

  await user.click(
    screen.getByRole("button", {
      name: "Paramétrer les frais de notaire et de courtier",
    }),
  );

  await assertNoA11yViolations(container);
});
