export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  id,
  align = 'start',
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  id: string;
  align?: 'start' | 'center';
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className="text-2xs font-medium uppercase tracking-[0.12em] text-foreground-muted">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
      >
        {title}
      </h2>
      {subtitle ? <p className="mt-3 text-base text-foreground-muted">{subtitle}</p> : null}
    </div>
  );
}
