import type { ReactNode } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/cn';

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** `surface` pinta a faixa de `bg-surface`, como as seções ímpares da landing. */
  tone?: 'plain' | 'surface';
  children: ReactNode;
};

/**
 * Seção de página com o mesmo cabeçalho da landing (`SectionHeading`) e o
 * `scroll-mt` necessário para as pílulas de navegação interna não ficarem
 * escondidas atrás do cabeçalho fixo.
 */
export function PageSection({ id, eyebrow, title, subtitle, tone = 'plain', children }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn(
        'scroll-mt-24 py-16 md:py-20',
        tone === 'surface' && 'border-y border-border bg-surface',
      )}
    >
      <div className="container-page">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} id={`${id}-title`} />
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
