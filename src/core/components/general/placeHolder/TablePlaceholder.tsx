export default function TablePlaceholder({
  rowCount = 5,
}: {
  rowCount?: number;
}) {
  return (
    <div role="status" aria-label="در حال دریافت جدول" className="space-y-3">
      {Array.from({ length: rowCount }, (_, index) => (
        <div
          key={index}
          className="h-10 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"
        />
      ))}
    </div>
  );
}
