import { useId } from "react";
import { Label } from "./Label";

type Props = {
  label?: string;
  value: number;
  onChange?: (value: number) => void;
  symbol: string;
  step?: string | number;
  disabled?: boolean;
};

export const Input = ({
  label,
  value,
  onChange,
  symbol,
  step = 10,
  disabled = false,
}: Props) => {
  const id = useId();

  return (
    <div>
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step={step}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className="w-full rounded-lg border border-gray-300 py-3 ps-4 pe-16 tabular-nums focus:border-transparent focus:ring-2 focus:ring-blue-500"
        />
        <span className="pointer-events-none absolute inset-y-0 end-10 flex items-center text-gray-500">
          {symbol}
        </span>
      </div>
    </div>
  );
};
