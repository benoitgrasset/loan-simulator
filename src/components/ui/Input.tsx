import { useId } from "react";
import { Label } from "./Label";

type Props = {
  label?: string;
  value: number;
  onChange?: (value: number) => void;
  symbol: string;
  step?: string | number;
  min?: number;
  disabled?: boolean;
};

export const Input = ({
  label,
  value,
  onChange,
  symbol,
  step = 10,
  min = 0,
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
          min={min}
          disabled={disabled}
          value={value}
          onChange={(e) =>
            onChange?.(Math.max(min, Number(e.target.value) || 0))
          }
          className="w-full rounded-lg border border-gray-300 bg-white py-3 ps-4 pe-4 tabular-nums transition-[border-color,box-shadow] duration-150 ease-out hover:border-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-600 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
        />
        <span className="pointer-events-none absolute inset-y-0 end-10 flex items-center text-gray-500">
          {symbol}
        </span>
      </div>
    </div>
  );
};
