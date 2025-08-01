export default function TitleHeader({ title }: { title: string }) {
  return (
    <div>
      <h3 className="text-2xl font-bold">{title}</h3>
    </div>
  );
}
