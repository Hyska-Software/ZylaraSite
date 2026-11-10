/**
 * O site do Zylara tem um único tema: escuro.
 *
 * Não existe alternância claro/escuro nem persistência de preferência — os
 * tokens vivem em `globals.css` (`:root`, sempre escuro) e estes valores
 * existem apenas para o que o Next precisa em tempo de build (viewport,
 * theme-color, OG images).
 */
export const theme = {
  colorScheme: 'dark' as const,
  background: '#17171a',
  surface: '#101012',
  surfaceRaised: '#1e1e22',
  foreground: '#ececf1',
  foregroundMuted: '#a1a1ab',
  border: '#28282e',
  accent: '#8b7bff',
  accentSoft: '#221d3a',
  brand: '#5e34fb',
  brandMuzzle: '#eadffc',
} as const;

export type ThemeColors = typeof theme;
