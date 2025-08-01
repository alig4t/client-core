export default function Column({
  title,
  value,
}: {
  title: string | React.ReactNode;
  value: string | React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-2">
      <span className="text-xs text-muted-foreground">{title}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
