import { cn } from "../../utils/tailwind";

type Props = React.LabelHTMLAttributes<HTMLLabelElement> & {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
};

export const Label = ({ children, htmlFor, className }: Props) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("block text-sm font-medium text-gray-700 mb-2", className)}
    >
      {children}
    </label>
  );
};
