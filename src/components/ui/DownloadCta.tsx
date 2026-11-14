'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { PlatformIcon } from '@/components/download/PlatformIcon';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import { isExperimentalPlatform, type DownloadPlatform, type LatestRelease } from '@/lib/site';

/**
 * CTA de download que entrega o instalador do sistema, não uma página de
 * escolha.
 *
 * O HTML do servidor traz o rótulo genérico ("Baixar para desktop") apontando
 * para `/download`; a plataforma é detectada depois da hidratação e só então o
 * link vira o asset real da release. É de propósito: nada de adivinhar o SO no
 * servidor (o cache é compartilhado entre visitantes) e nada de layout shift —
 * só troca o href e o rótulo.
 */

type Props = {
  release: LatestRelease;
  size?: 'md' | 'lg';
  className?: string;
};

const sizes: Record<NonNullable<Props['size']>, string> = {
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-full bg-foreground font-medium text-background ' +
  'transition-colors duration-150 hover:bg-foreground/90 active:bg-foreground/85 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

function detectPlatform(): DownloadPlatform | null {
  if (typeof navigator === 'undefined') return null;

  const hint = `${navigator.userAgent} ${navigator.platform ?? ''}`.toLowerCase();

  if (hint.includes('windows')) return 'windows';
  if (hint.includes('mac os') || hint.includes('macintosh') || hint.includes('macintel')) {
    return 'macos';
  }
  if (hint.includes('linux') || hint.includes('x11')) return 'linux';

  return null;
}

export function DownloadCta({ release, size = 'lg', className }: Props) {
  const t = useTranslations('Download');
  const [platform, setPlatform] = useState<DownloadPlatform | null>(null);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const asset = platform ? release.downloads[platform].files[0] : undefined;
  const label =
    platform && asset ? t('downloadFor', { platform: t(`${platform}.label`) }) : t('downloadGeneric');
  const experimental = platform ? isExperimentalPlatform(platform) : false;

  const content = (
    <>
      {platform ? <PlatformIcon platform={platform} size={17} /> : null}
      <span>{label}</span>
      {experimental ? <span className="text-background/70">· beta</span> : null}
    </>
  );

  if (asset) {
    return (
      <a href={asset.url} className={cn(base, sizes[size], className)}>
        {content}
      </a>
    );
  }

  return (
    <Link href="/download" className={cn(base, sizes[size], className)}>
      {content}
    </Link>
  );
}
