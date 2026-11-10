import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { theme } from '@/lib/theme';

export const alt = 'Lumina — desktop workspace for coding agents';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const hero = await getTranslations({ locale, namespace: 'Hero' });

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: theme.background,
          padding: 72,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              background: theme.brand,
              display: 'flex',
            }}
          />
          <div style={{ color: theme.foreground, fontSize: 32, fontWeight: 600 }}>Lumina</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              color: theme.foreground,
              fontSize: 66,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              maxWidth: 900,
            }}
          >
            {`${hero('title')} ${hero('titleAccent')}`}
          </div>
          <div style={{ color: theme.foregroundMuted, fontSize: 28, maxWidth: 880 }}>
            {t('description')}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              color: theme.accent,
              background: theme.accentSoft,
              borderRadius: 999,
              padding: '8px 20px',
              fontSize: 22,
            }}
          >
            local-first
          </div>
          <div
            style={{
              color: theme.foregroundMuted,
              border: `1px solid ${theme.border}`,
              borderRadius: 999,
              padding: '8px 20px',
              fontSize: 22,
            }}
          >
            Windows · macOS · Linux
          </div>
        </div>
      </div>
    ),
    size,
  );
}
