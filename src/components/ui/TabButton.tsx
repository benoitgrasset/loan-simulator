import { LucideIcon } from "lucide-react";
import React from "react";
import { cn } from "../../utils/tailwind";

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: LucideIcon;
  children: React.ReactNode;
  activeColor?: "blue" | "green" | "purple" | "red";
}

const TabButton = ({
  isActive,
  onClick,
  icon: Icon,
  children,
  activeColor = "blue",
}: TabButtonProps) => {
  const activeTextColor = `text-${activeColor}-600`;

  return (
    <button
      onClick={onClick}
      className={cn(
        "cursor-pointer flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
        isActive
          ? `bg-white ${activeTextColor} shadow-sm`
          : "text-gray-600 hover:text-gray-900"
      )}
    >
      <Icon className="w-4 h-4" />
      {children}
    </button>
  );
};

export default TabButton;
