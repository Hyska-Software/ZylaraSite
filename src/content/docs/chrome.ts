import type { Locale } from '@/i18n/routing';
import type { DocsChrome } from '@/content/docs/types';

/**
 * Rótulos da moldura da documentação, por idioma.
 *
 * Os textos das páginas vêm do acervo em `user-docs/` (inglês); o que muda aqui
 * é só a interface do shell: busca, índice lateral, anterior/próxima.
 */
const chrome: Record<Locale, DocsChrome> = {
  en: {
    label: 'Docs',
    menu: 'Menu',
    closeMenu: 'Close menu',
    nav: 'Documentation',
    search: 'Search',
    searchPlaceholder: 'Search the documentation',
    searchEmpty: 'No page matches this search.',
    searchHint: 'Ctrl K',
    searchOpen: 'Open search',
    onThisPage: 'On this page',
    previous: 'Previous',
    next: 'Next',
    pagination: 'Page navigation',
    repository: 'Repository',
    copy: 'Copy',
    copied: 'Copied',
    downloads: 'Downloads',
    publishedVersion: 'Published version',
    releaseNotes: 'Release notes',
    allReleases: 'All releases',
    checksums: 'SHA-256 checksums',
  },

  'pt-BR': {
    label: 'Docs',
    menu: 'Menu',
    closeMenu: 'Fechar menu',
    nav: 'Documentação',
    search: 'Buscar',
    searchPlaceholder: 'Buscar na documentação',
    searchEmpty: 'Nenhuma página corresponde a esta busca.',
    searchHint: 'Ctrl K',
    searchOpen: 'Abrir busca',
    onThisPage: 'Nesta página',
    previous: 'Anterior',
    next: 'Próxima',
    pagination: 'Navegação entre páginas',
    repository: 'Repositório',
    copy: 'Copiar',
    copied: 'Copiado',
    downloads: 'Downloads',
    publishedVersion: 'Versão publicada',
    releaseNotes: 'Notas da versão',
    allReleases: 'Todas as versões',
    checksums: 'Somas SHA-256',
  },

  'zh-CN': {
    label: '文档',
    menu: '菜单',
    closeMenu: '关闭菜单',
    nav: '文档',
    search: '搜索',
    searchPlaceholder: '搜索文档',
    searchEmpty: '没有匹配此搜索的页面。',
    searchHint: 'Ctrl K',
    searchOpen: '打开搜索',
    onThisPage: '本页内容',
    previous: '上一篇',
    next: '下一篇',
    pagination: '页面导航',
    repository: '仓库',
    copy: '复制',
    copied: '已复制',
    downloads: '下载',
    publishedVersion: '已发布版本',
    releaseNotes: '发行说明',
    allReleases: '全部版本',
    checksums: 'SHA-256 校验值',
  },
};

export function docsChrome(locale: Locale): DocsChrome {
  return chrome[locale];
}
