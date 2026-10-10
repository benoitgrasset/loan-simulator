import { cn } from "../../utils/tailwind";

type Props = {
  label: string;
  value: string;
  hint?: string;
  tone?: "neutral" | "accent" | "strong";
  className?: string;
};

export const ValueRow = ({
  label,
  value,
  hint,
  tone = "neutral",
  className,
}: Props) => (
  <div
    className={cn(
      "flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 rounded-lg px-3 py-2.5",
      tone === "accent" ? "bg-blue-50" : "bg-gray-50",
      className,
    )}
  >
    <span className="text-sm text-gray-700">
      {label}
      {hint ? <span className="text-gray-500"> · {hint}</span> : null}
    </span>
    <span
      className={cn(
        "text-sm tabular-nums whitespace-nowrap",
        tone === "accent" && "font-semibold text-blue-700",
        tone === "strong" && "font-semibold text-gray-900",
        tone === "neutral" && "font-medium text-gray-900",
      )}
    >
      {value}
    </span>
  </div>
);
