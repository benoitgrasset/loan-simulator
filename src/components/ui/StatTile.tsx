import { cn } from "../../utils/tailwind";

type Props = {
  label: string;
  value: string;
  hint?: string;
  tone?: "neutral" | "accent" | "interest";
};

const VALUE_TONE: Record<NonNullable<Props["tone"]>, string> = {
  neutral: "text-gray-900",
  accent: "text-blue-700",
  interest: "text-interest-strong",
};

export const StatTile = ({ label, value, hint, tone = "neutral" }: Props) => (
  <div className="rounded-xl border border-transparent bg-white p-5 shadow-card">
    <p className="text-sm font-medium text-gray-600">{label}</p>
    <p
      className={cn(
        "mt-1 text-2xl font-semibold tracking-[-0.02em] tabular-nums",
        VALUE_TONE[tone],
      )}
    >
      {value}
    </p>
    {hint ? (
      <p className="mt-1 text-sm text-gray-600 text-pretty">{hint}</p>
    ) : null}
  </div>
);

type GroupProps = {
  label: string;
  className?: string;
  children: React.ReactNode;
};

export const StatGroup = ({ label, className, children }: GroupProps) => (
  <section
    aria-label={label}
    className={cn("grid gap-4", className)}
  >
    {children}
  </section>
);
