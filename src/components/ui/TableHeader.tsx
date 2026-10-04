import { cn } from "../../utils/tailwind";

type Props = {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
};

const TableHeader = ({ children, align = "left", className = "" }: Props) => {
  const alignmentClass = `text-${align}`;
  const baseClasses =
    "px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider";

  return (
    <th className={cn(baseClasses, alignmentClass, className)}>{children}</th>
  );
};

export default TableHeader;
