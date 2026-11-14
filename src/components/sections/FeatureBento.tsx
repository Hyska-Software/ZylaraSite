import { getTranslations } from 'next-intl/server';
import { cn } from '@/lib/cn';
import { featureAnchor, type FeatureMenuKey } from '@/lib/site';
import { SectionHeading } from '@/components/ui/SectionHeading';
import {
  DiffFragment,
  FolderFragment,
  ModesFragment,
  PermissionFragment,
  PlanFragment,
  SkillsFragment,
} from '@/components/sections/fragments';

type FeatureKey = FeatureMenuKey;

const features: { key: FeatureKey; span: string }[] = [
  { key: 'localFirst', span: 'md:col-span-2' },
  { key: 'planMode', span: '' },
  { key: 'permissions', span: '' },
  { key: 'diffs', span: 'md:col-span-2' },
  { key: 'skills', span: '' },
  { key: 'modes', span: 'md:col-span-2' },
];

/**
 * Bento de recursos.
 *
 * O `id` de cada card é o âncora que o menu "Recursos" do cabeçalho usa
 * (`featureAnchor`); sem ele os itens do menu não levam a lugar nenhum.
 * Os visuais são fragmentos reais da UI do app, não placeholders.
 */
export async function FeatureBento() {
  const t = await getTranslations('Features');

  return (
    <section id="features" aria-labelledby="features-title" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
          id="features-title"
        />

        <ul className="mt-12 grid gap-3 md:grid-cols-3">
          {features.map((feature) => (
            <li
              key={feature.key}
              id={featureAnchor(feature.key)}
              className={cn('min-w-0 scroll-mt-24', feature.span)}
            >
              <article className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-border bg-surface-raised p-6 transition-colors duration-200 hover:border-border-strong">
                <div>
                  <h3 className="text-lg font-medium text-foreground">
                    {t(`items.${feature.key}.title`)}
                  </h3>
                  <p className="mt-2 max-w-prose text-sm text-foreground-muted">
                    {t(`items.${feature.key}.description`)}
                  </p>
                </div>
                <FeatureVisual feature={feature.key} />
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Fragmento da UI correspondente ao recurso — decorativo para o leitor de tela. */
function FeatureVisual({ feature }: { feature: FeatureKey }) {
  if (feature === 'localFirst') return <FolderFragment decorative />;
  if (feature === 'planMode') return <PlanFragment decorative />;
  if (feature === 'permissions') return <PermissionFragment decorative />;
  if (feature === 'diffs') return <DiffFragment decorative />;
  if (feature === 'skills') return <SkillsFragment decorative />;
  return <ModesFragment decorative />;
}
