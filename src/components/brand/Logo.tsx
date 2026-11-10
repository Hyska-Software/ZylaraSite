import { cn } from '@/lib/cn';
import { ZylaraGlyph } from './ZylaraGlyph';

type LogoProps = { className?: string; size?: number; withWordmark?: boolean };

/** Marca do Zylara: símbolo oficial + wordmark. Nunca é recolorizada. */
export function Logo({ className, size = 26, withWordmark = true }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <ZylaraGlyph size={size} />
      {withWordmark ? (
        <span className="text-lg font-semibold tracking-tight text-foreground">Zylara</span>
      ) : null}
    </span>
  );
}
