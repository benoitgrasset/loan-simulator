type RadioProps<T extends string> = {
  name: string;
  value: T;
  checked: boolean;
  onChange: (value: T) => void;
};

export const Radio = <T extends string>({
  name,
  value,
  checked,
  onChange,
}: RadioProps<T>) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={() => onChange(value)}
    />
    <span>{value}</span>
  </label>
);

type RadioButtonGroupProps<T extends string> = {
  name: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;
};

export const RadioButtonGroup = <T extends string>({
  name,
  options,
  value,
  onChange,
}: RadioButtonGroupProps<T>) => (
  <div role="radiogroup" className="flex flex-col gap-3 w-fit">
    {options.map((option) => (
      <Radio
        key={option}
        name={name}
        value={option}
        checked={value === option}
        onChange={onChange}
      />
    ))}
  </div>
);

/* Usage

const [etat, setEtat] = useState("neuf");

<RadioButtonGroup
  name="etat"
  options={["neuf", "ancien"]}
  value={etat}
  onChange={setEtat}
/>
*/
