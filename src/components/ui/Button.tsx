import { cn } from "../../utils/tailwind";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ className, type = "button", ...props }: Props) => (
  <button type={type} className={cn("cursor-pointer", className)} {...props} />
);
