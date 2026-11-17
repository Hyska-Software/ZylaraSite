import { Fragment } from 'react';
import type { InlineNode } from '@/content/docs/types';
import { Link } from '@/i18n/navigation';

/**
 * Renderiza um trecho inline vindo do Markdown.
 *
 * O parser entrega dados (`InlineNode[]`), nunca HTML: link, `code`, **forte** e
 * *ênfase* viram elementos React com os tokens do site. Caminhos internos
 * (`/docs/...`, `/download`) passam pelo `Link` do next-intl, que aplica o
 * prefixo do idioma; `http(s)` abre em outra aba.
 */

const LINK_CLASS =
  'rounded text-foreground underline decoration-border-strong underline-offset-2 transition-colors duration-150 hover:decoration-foreground';

export function DocsInline({ nodes }: { nodes: readonly InlineNode[] }) {
  return (
    <>
      {nodes.map((node, index) => (
        <Fragment key={index}>{renderNode(node)}</Fragment>
      ))}
    </>
  );
}

function renderNode(node: InlineNode) {
  switch (node.t) {
    case 'text':
      return node.v;

    case 'code':
      return (
        <code className="rounded-[5px] bg-surface-hover px-1 py-0.5 font-mono text-[0.92em] text-foreground">
          {node.v}
        </code>
      );

    case 'strong':
      return (
        <strong className="font-medium text-foreground">
          <DocsInline nodes={node.c} />
        </strong>
      );

    case 'em':
      return (
        <em>
          <DocsInline nodes={node.c} />
        </em>
      );

    case 'link':
      return node.href.startsWith('http') ? (
        <a href={node.href} target="_blank" rel="noreferrer noopener" className={LINK_CLASS}>
          {node.v}
        </a>
      ) : (
        <Link href={node.href} className={LINK_CLASS}>
          {node.v}
        </Link>
      );
  }
}
