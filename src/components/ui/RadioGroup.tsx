type RadioProps = {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
};

export const Radio = ({ name, value, checked, onChange }: RadioProps) => (
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

type RadioButtonGroupProps = {
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

export const RadioButtonGroup = ({
  name,
  options,
  value,
  onChange,
}: RadioButtonGroupProps) => (
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
