type LabelProps = {
  children: string;
};
const Label = ({ children }: LabelProps) => {
  return (
    <label
      htmlFor={"name"}
      className="block text-sm font-medium text-[var(--text-secondary)] text-right mb-1.5 min-h-5"
    >
      {children}
    </label>
  );
};

export default Label;
