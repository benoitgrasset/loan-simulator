type Props = {
  children: React.ReactNode;
  htmlFor?: string;
};

export const Label = ({ children, htmlFor }: Props) => {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      {children}
    </label>
  );
};
