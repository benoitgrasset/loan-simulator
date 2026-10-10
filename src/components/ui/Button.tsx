import { cn } from "../../utils/tailwind";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Disables the press scale, for surfaces where it would distract. */
  static?: boolean;
};

export const Button = ({
  className,
  type = "button",
  static: isStatic = false,
  ...props
}: Props) => (
  <button
    type={type}
    className={cn(
      "cursor-pointer transition-[scale,background-color,color,box-shadow] duration-150 ease-out disabled:cursor-not-allowed",
      !isStatic && "motion-safe:enabled:active:scale-[0.96]",
      className,
    )}
    {...props}
  />
);
