
export default function AdminLoading() {
  return (
    <div
      dir="rtl"
      role="status"
      aria-label="جاري تحميل لوحة التحكم"
      className="mx-auto max-w-350 animate-pulse space-y-8"
    >
      <div className="h-9 w-56 rounded-xl bg-neutral-200" />

      <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-40 rounded-2xl bg-neutral-200"
          />
        ))}
      </div>

      <div className="h-36 rounded-2xl bg-neutral-200" />
      <div className="h-72 rounded-2xl bg-neutral-200" />
    </div>
  );
}
