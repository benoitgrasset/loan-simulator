import { cn } from "../../utils/tailwind";

type Props = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

export const Card = ({
  title,
  description,
  actions,
  className,
  children,
}: Props) => (
  <section
    className={cn(
      "rounded-xl border border-transparent bg-white p-5 shadow-card",
      className,
    )}
  >
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3",
        children && "mb-4",
      )}
    >
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-gray-800 text-balance">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-gray-500 text-pretty">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
    {children}
  </section>
);
