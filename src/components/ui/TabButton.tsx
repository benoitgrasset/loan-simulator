import { LucideIcon } from "lucide-react";
import React from "react";
import { cn } from "../../utils/tailwind";
import { Button } from "./Button";

type ActiveColor = "blue" | "green" | "purple" | "red";

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: LucideIcon;
  children: React.ReactNode;
  activeColor?: ActiveColor;
}

const ACTIVE_TEXT: Record<ActiveColor, string> = {
  blue: "text-blue-700",
  green: "text-green-700",
  purple: "text-purple-700",
  red: "text-red-700",
};

const TabButton = ({
  isActive,
  onClick,
  icon: Icon,
  children,
  activeColor = "blue",
}: TabButtonProps) => (
  <Button
    onClick={onClick}
    aria-pressed={isActive}
    className={cn(
      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium sm:px-4",
      isActive
        ? `bg-white ${ACTIVE_TEXT[activeColor]} shadow-sm`
        : "text-gray-600 hover:text-gray-900",
    )}
  >
    <Icon className="h-4 w-4 shrink-0" />
    {children}
  </Button>
);

export default TabButton;
