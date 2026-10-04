type Props = {
  value: number;
  onChange: (value: number) => void;
  symbol: string;
  step?: string | number;
  disabled?: boolean;
};

export const Input = ({
  value,
  onChange,
  symbol,
  step = 10,
  disabled = false,
}: Props) => {
  return (
    <div className="relative">
      <input
        type="number"
        step={step}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="3.5"
      />
      <span className="absolute right-10 top-3 text-gray-500">{symbol}</span>
    </div>
  );
};
