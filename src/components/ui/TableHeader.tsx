import React from "react";
import { cn } from "../../utils/tailwind";

interface TableHeaderProps {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  align = "left",
  className = "",
}) => {
  const alignmentClass = `text-${align}`;
  const baseClasses =
    "px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider";

  return (
    <th className={cn(baseClasses, alignmentClass, className)}>{children}</th>
  );
};

export default TableHeader;
