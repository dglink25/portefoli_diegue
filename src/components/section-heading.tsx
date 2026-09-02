export function SectionHeading({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div>
      {eyebrow && <p className="text-xs font-medium text-primary">{eyebrow}</p>}
      <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
    </div>
  );
}
