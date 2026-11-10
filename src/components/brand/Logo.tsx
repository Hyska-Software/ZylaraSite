import { cn } from '@/lib/cn';
import { LuminaGlyph } from './LuminaGlyph';

type LogoProps = { className?: string; size?: number; withWordmark?: boolean };

/** Marca do Lumina: símbolo oficial + wordmark. Nunca é recolorizada. */
export function Logo({ className, size = 26, withWordmark = true }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LuminaGlyph size={size} />
      {withWordmark ? (
        <span className="text-lg font-semibold tracking-tight text-foreground">Lumina</span>
      ) : null}
    </span>
  );
}
