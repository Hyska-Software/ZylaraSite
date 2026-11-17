import { Fragment } from 'react';
import { Link } from '@/i18n/navigation';

/**
 * Marcação inline do conteúdo da documentação.
 *
 * A prosa é texto puro no catálogo, mas precisa de dois recursos: link
 * (`[rótulo](url)`) e código (`` `x` ``). Em vez de um parser de Markdown
 * completo — e de `dangerouslySetInnerHTML` — este componente tokeniza só esses
 * dois padrões e devolve nós React: nenhuma string do catálogo vira HTML.
 *
 * Caminhos internos (`/docs/install`, `/download`) passam pelo `Link` do
 * next-intl, então o prefixo do idioma é aplicado; `http(s)` abre em nova aba.
 */

type Segment = { kind: 'text'; text: string } | { kind: 'link'; text: string; href: string } | { kind: 'code'; text: string };

const TOKEN = /\[([^\]]+)\]\(([^)\s]+)\)|`([^`]+)`/g;

export function docsInlineSegments(value: string): Segment[] {
  const segments: Segment[] = [];
  let cursor = 0;

  for (const match of value.matchAll(TOKEN)) {
    const start = match.index;
    if (start > cursor) segments.push({ kind: 'text', text: value.slice(cursor, start) });

    const [, linkLabel, linkHref, code] = match;

    if (code !== undefined) {
      segments.push({ kind: 'code', text: code });
    } else if (linkLabel !== undefined && linkHref !== undefined) {
      segments.push({ kind: 'link', text: linkLabel, href: linkHref });
    }

    cursor = start + match[0].length;
  }

  if (cursor < value.length) segments.push({ kind: 'text', text: value.slice(cursor) });

  return segments;
}

export function DocsInline({ text }: { text: string }) {
  return (
    <>
      {docsInlineSegments(text).map((segment, index) => {
        if (segment.kind === 'code') {
          return (
            <code
              key={index}
              className="rounded-[5px] bg-surface-hover px-1 py-0.5 font-mono text-[0.92em] text-foreground"
            >
              {segment.text}
            </code>
          );
        }

        if (segment.kind === 'link') {
          const className =
            'rounded text-foreground underline decoration-border-strong underline-offset-2 transition-colors duration-150 hover:decoration-foreground';

          return segment.href.startsWith('http') ? (
            <a key={index} href={segment.href} target="_blank" rel="noreferrer noopener" className={className}>
              {segment.text}
            </a>
          ) : (
            <Link key={index} href={segment.href} className={className}>
              {segment.text}
            </Link>
          );
        }

        return <Fragment key={index}>{segment.text}</Fragment>;
      })}
    </>
  );
}
