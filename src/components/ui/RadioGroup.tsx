import { cn } from "../../utils/tailwind";

type RadioProps<T extends string> = {
  name: string;
  value: T;
  checked: boolean;
  onChange: (value: T) => void;
  hint?: string;
};

export const Radio = <T extends string>({
  name,
  value,
  checked,
  onChange,
  hint,
}: RadioProps<T>) => {
  const hintId = `${name}-${value}-hint`;

  return (
    <div className="group/radio relative">
      <label
        className={cn(
          "flex items-center justify-center cursor-pointer px-4 py-1.5 rounded-md text-sm font-medium transition-[color,background-color,box-shadow] duration-150 ease-out has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-600",
          checked
            ? "bg-white text-blue-700 shadow-sm"
            : "text-gray-600 hover:text-gray-900",
        )}
      >
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          className="sr-only"
          aria-describedby={hint ? hintId : undefined}
        />
        <span>{value}</span>
      </label>
      {hint ? (
        <span
          id={hintId}
          role="tooltip"
          className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-max max-w-xs -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-left text-xs font-normal leading-5 text-white whitespace-pre-line opacity-0 shadow-lg transition-opacity duration-150 ease-out group-hover/radio:opacity-100 group-focus-within/radio:opacity-100"
        >
          {hint}
        </span>
      ) : null}
    </div>
  );
};

type RadioButtonGroupProps<T extends string> = {
  name: string;
  label: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;
  hints?: Partial<Record<T, string>>;
};

export const RadioButtonGroup = <T extends string>({
  name,
  label,
  options,
  value,
  onChange,
  hints,
}: RadioButtonGroupProps<T>) => (
  <div role="radiogroup" aria-label={label} className="inline-flex gap-1 bg-gray-100 p-1 rounded-[10px]">
    {options.map((option) => (
      <Radio
        key={option}
        name={name}
        value={option}
        checked={value === option}
        onChange={onChange}
        hint={hints?.[option]}
      />
    ))}
  </div>
);
