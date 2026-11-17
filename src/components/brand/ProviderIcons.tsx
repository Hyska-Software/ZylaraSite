import { PROVIDER_GLYPHS, type ProviderIconName } from './provider-glyphs';

/**
 * Renderiza os glifos oficiais das marcas.
 *
 * Os dados vêm de `provider-glyphs.ts` (gerado por
 * `scripts/build-provider-glyphs.mjs` a partir de `@lobehub/icons-static-svg`,
 * MIT) — o mesmo conjunto que o app usa em `docs/MODEL_ICONS.md`.
 *
 * Só marcas de modelo entram aqui. MCP e Skills são capacidades do produto, não
 * provedores: MCP não aparece no site e Skills tem seus próprios lugares
 * (prévia do app, card de recursos e FAQ).
 *
 * A nuvem da seção de provedores repete cada marca várias vezes para o marquee
 * nunca deixar buraco. Para isso não multiplicar o HTML, existem duas peças:
 * `ProviderGlyphSprite` (define cada `<symbol>` uma única vez) e `BrandIcon`
 * (referencia com `<use>`). O sprite é invisível, aparece **uma única vez por
 * documento** e precisa vir antes de qualquer `BrandIcon` — hoje é o primeiro
 * filho do `<main>` da home (`src/app/[locale]/page.tsx`), porque o hero também
 * usa os glifos. Dois sprites na mesma página duplicariam os ids e o `<use>`
 * passaria a apontar para o primeiro símbolo encontrado.
 */

const SPRITE_ID = 'provider-glyphs';

type BrandIconProps = { name: ProviderIconName; size?: number; className?: string };

/** Define todos os glifos uma vez. Renderize antes dos ícones, na mesma página. */
export function ProviderGlyphSprite() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        {Object.entries(PROVIDER_GLYPHS).map(([name, glyph]) => (
          <symbol key={name} id={`${SPRITE_ID}-${name}`} viewBox={glyph.viewBox}>
            {glyph.paths.map((d) => (
              <path key={d.slice(0, 24)} d={d} />
            ))}
          </symbol>
        ))}
      </defs>
    </svg>
  );
}

export function BrandIcon({ name, size = 16, className }: BrandIconProps) {
  return (
    <svg
      width={size}
      height={size}
      fill="currentColor"
      fillRule="evenodd"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <use href={`#${SPRITE_ID}-${name}`} />
    </svg>
  );
}
