import { cn } from '@/lib/cn';
import { Link } from '@/i18n/navigation';
import type { ComponentProps } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap ' +
  'transition-[background-color,color,border-color,box-shadow,transform] duration-150 ease-out ' +
  'disabled:pointer-events-none disabled:opacity-50 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

const variants: Record<Variant, string> = {
  // Botão primário do app: sólido em `foreground`, sem gradiente (DESIGN.md §15).
  primary: 'bg-foreground text-background hover:bg-foreground/90 active:bg-foreground/85',
  secondary:
    'border border-border-strong bg-surface-raised text-foreground hover:bg-surface-hover active:bg-surface-hover',
  ghost: 'text-foreground hover:bg-surface-hover',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

type CommonProps = { variant?: Variant; size?: Size; className?: string };

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: CommonProps & ComponentProps<'button'>) {
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  href,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

export function ExternalButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: CommonProps & ComponentProps<'a'>) {
  return (
    <a
      className={cn(base, variants[variant], sizes[size], className)}
      target="_blank"
      rel="noreferrer noopener"
      {...props}
    />
  );
}
