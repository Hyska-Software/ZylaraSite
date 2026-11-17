import type { DocsContent } from '@/content/docs/types';

/**
 * Conteúdo da documentação em português (idioma de redação original).
 *
 * Os textos falam de download, primeiro uso, provedores, permissões e
 * problemas comuns — o essencial para instalar e rodar o app. Páginas novas
 * entram em `pages`, na ordem em que devem aparecer na navegação.
 */
export const ptBR: DocsContent = {
  chrome: {
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
    groups: {
      start: 'Introdução',
      configure: 'Configuração',
      help: 'Ajuda',
    },
    previous: 'Anterior',
    next: 'Próxima',
    pagination: 'Navegação entre páginas',
    repository: 'Repositório',
    latest: 'Versão publicada',
    formats: 'Formatos',
    allDownloads: 'Todas as versões',
    checksums: 'Somas SHA-256',
    copy: 'Copiar',
    copied: 'Copiado',
    beta: 'Beta',
  },

  pages: [
    {
      slug: 'intro',
      group: 'start',
      title: 'Introdução',
      summary: 'O que é o Zylara, como baixar e o que esperar no primeiro uso.',
      lede: 'O Zylara é um espaço de trabalho local-first para agentes de código. Ele planeja antes de escrever, pede aprovação antes de executar e mostra cada diff — sem que seus arquivos ou chaves saiam da sua máquina.',
      sections: [
        {
          id: 'download',
          title: 'Download',
          blocks: [
            {
              kind: 'text',
              text: 'Os instaladores abaixo vêm da release estável mais recente publicada no [repositório](https://github.com/Hyska-Software/ZylaraAi/releases). Windows é o build principal; macOS e Linux ainda são builds beta.',
            },
            { kind: 'installers' },
            {
              kind: 'text',
              text: 'A página [de download](/download) mostra todos os formatos, as arquiteturas de cada plataforma e as somas SHA-256 da versão.',
            },
          ],
        },
        {
          id: 'first-run',
          title: 'Primeiro uso',
          blocks: [
            {
              kind: 'list',
              ordered: true,
              items: [
                'Conecte um provedor em Configurações → Provedores: chave do OpenCode (Go ou Zen), conta ChatGPT ou chave da OpenAI, ou chave da Anthropic.',
                'Escolha o modelo no seletor do composer. O catálogo tem mais de 160 modelos e o esforço de raciocínio é definido por modelo.',
                'Escolha o modo na barra de título: `Chat`, `Code` ou `Agentes`.',
                'Comece uma conversa ou abra uma pasta para o agente trabalhar.',
              ],
            },
            {
              kind: 'note',
              label: 'Antes de começar',
              text: 'A chave do OpenCode CLI, se você já usa, é detectada automaticamente — não precisa colar de novo.',
            },
          ],
        },
        {
          id: 'modes',
          title: 'Modos',
          blocks: [
            {
              kind: 'list',
              items: [
                '`Chat` — conversa com documentos, busca na web com citações, artefatos e UI generativa.',
                '`Code` — workspace de código, com plano antes da escrita, aprovações, diffs e terminal.',
                '`Agentes` — vários agentes em paralelo, cada um com o próprio plano e transcript.',
              ],
            },
          ],
        },
        {
          id: 'local-first',
          title: 'Local-first',
          blocks: [
            {
              kind: 'text',
              text: 'Conversas, anexos e artefatos ficam num banco SQLite na sua máquina. As chaves de API são guardadas localmente e nunca são expostas ao renderer. As requisições vão direto para o provedor escolhido: nada passa por um servidor do Zylara.',
            },
            {
              kind: 'list',
              items: [
                'Histórico, busca, fixar, renomear e exportar ficam dentro do app.',
                'Busca na web e leitura de páginas só acontecem quando o agente usa a ferramenta.',
                'Execução de código é opt-in e roda num workspace isolado, com timeout e cancelamento.',
              ],
            },
          ],
        },
        {
          id: 'next-steps',
          title: 'Próximos passos',
          blocks: [
            {
              kind: 'list',
              items: [
                '[Instalação](/docs/install) — instaladores, verificação de checksum e atualizações.',
                '[Provedores e modelos](/docs/providers) — como autenticar em cada provedor.',
                '[Permissões](/docs/permissions) — plano, aprovações e execução de código.',
                '[Solução de problemas](/docs/troubleshooting) — quando algo não abre ou não conecta.',
              ],
            },
          ],
        },
      ],
    },

    {
      slug: 'install',
      group: 'start',
      title: 'Instalação',
      summary: 'Instaladores por plataforma, verificação de checksum, atualizações e desinstalação.',
      lede: 'O Zylara é distribuído como instalador nativo em cada plataforma. A versão publicada é lida da release mais recente do GitHub, então esta página acompanha o app sem precisar de deploy.',
      sections: [
        {
          id: 'downloads',
          title: 'Instaladores',
          blocks: [
            {
              kind: 'text',
              text: 'Baixe o pacote da sua plataforma. macOS e Linux ainda são builds beta e podem mudar entre versões.',
            },
            { kind: 'installers' },
          ],
        },
        {
          id: 'verify',
          title: 'Verifique o checksum',
          blocks: [
            {
              kind: 'text',
              text: 'Cada release publica um `SHA256SUMS.txt`. Compare o hash do arquivo baixado com o da lista antes de executar o instalador.',
            },
            {
              kind: 'code',
              tabs: [
                {
                  label: 'Windows',
                  code: 'certutil -hashfile Zylara-Setup-<versão>-windows-x64.exe SHA256',
                },
                { label: 'macOS', code: 'shasum -a 256 Zylara-<versão>-macos-arm64.dmg' },
                {
                  label: 'Linux',
                  code: 'sha256sum Zylara-<versão>-linux-x64.AppImage',
                },
              ],
            },
            {
              kind: 'note',
              label: 'Hash diferente',
              text: 'Se a soma não bater, baixe o arquivo de novo: download incompleto é a causa mais comum. Não execute um instalador cujo hash não confere.',
            },
          ],
        },
        {
          id: 'requirements',
          title: 'Requisitos',
          blocks: [
            {
              kind: 'table',
              head: ['Plataforma', 'O que precisa existir'],
              rows: [
                ['Windows 10/11 (x64)', 'WebView2 — já vem nas builds atuais do Windows'],
                ['macOS (arm64)', 'macOS recente; build beta'],
                ['Linux (x64)', 'AppImage, `.deb` ou `.rpm`; glibc recente'],
              ],
            },
            {
              kind: 'text',
              text: 'Python 3.9+ e/ou Node só são necessários para a execução de código opcional. Configurações → Ferramentas mostra o ambiente detectado e o que falta.',
            },
          ],
        },
        {
          id: 'updates',
          title: 'Atualizações',
          blocks: [
            {
              kind: 'text',
              text: 'O app consulta as releases ao abrir e a cada hora. Quando existe versão estável mais nova, aparece um aviso na barra de título com as novidades e o tamanho do download.',
            },
            {
              kind: 'list',
              items: [
                'O download é verificado por SHA-256 antes de qualquer instalação.',
                'Nada instala sozinho: a instalação sempre pede confirmação.',
                'No Windows o app fecha e abre o wizard do Zylara; no macOS abre o DMG; no Linux abre o pacote ou o AppImage.',
                'A checagem manual fica em Configurações → Sobre → Atualizações.',
              ],
            },
          ],
        },
        {
          id: 'uninstall',
          title: 'Desinstalação',
          blocks: [
            {
              kind: 'list',
              items: [
                'Windows: use “Desinstalar Zylara” no Menu Iniciar; o desinstalador permite manter os dados.',
                'macOS: arraste o Zylara de Aplicativos para a Lixeira.',
                'Linux: remova pelo gerenciador de pacotes (`.deb`/`.rpm`) ou apague o AppImage.',
              ],
            },
            {
              kind: 'text',
              text: 'Os dados ficam na pasta de dados do app — histórico SQLite, artefatos e chaves. Apagar essa pasta zera o app por completo.',
            },
          ],
        },
      ],
    },

    {
      slug: 'providers',
      group: 'configure',
      title: 'Provedores e modelos',
      summary: 'Como autenticar no OpenCode, OpenAI e Anthropic e escolher modelos.',
      lede: 'O Zylara fala direto com três famílias de provedores. Você conecta pelo menos uma e escolhe o modelo na conversa.',
      sections: [
        {
          id: 'providers',
          title: 'Provedores',
          blocks: [
            {
              kind: 'table',
              head: ['Provedor', 'Como autenticar'],
              rows: [
                [
                  'OpenCode Go / Zen',
                  'API key do OpenCode Console. A chave do OpenCode CLI já instalado é detectada automaticamente.',
                ],
                [
                  'OpenAI',
                  'Continuar com ChatGPT (OAuth oficial, sem API key) ou uma API key `sk-…` da plataforma.',
                ],
                [
                  'Anthropic',
                  'API key `sk-ant-…` do Claude Console (pay-as-you-go, não usa assinatura). `ANTHROPIC_API_KEY` também é detectada.',
                ],
              ],
            },
            {
              kind: 'note',
              label: 'Plano ChatGPT',
              text: 'Com login ChatGPT, a lista de modelos é a da sua conta e o app mostra o indicador do plano na barra de título.',
            },
          ],
        },
        {
          id: 'models',
          title: 'Modelos',
          blocks: [
            {
              kind: 'text',
              text: 'O catálogo reúne mais de 160 modelos dos três provedores. O seletor do composer mostra apenas o que está disponível para a sua conta.',
            },
            {
              kind: 'list',
              items: [
                'O esforço de raciocínio é definido por modelo: desligado, por esforço ou por orçamento de tokens.',
                'Conversas podem ser fixadas, renomeadas, exportadas e buscadas no histórico local.',
                'Skills locais (`SKILL.md`) orientam o agente na geração de cada formato.',
              ],
            },
          ],
        },
        {
          id: 'keys',
          title: 'Onde as chaves ficam',
          blocks: [
            {
              kind: 'text',
              text: 'As chaves são gravadas localmente no app-data e nunca são expostas ao renderer. As requisições vão direto para o provedor escolhido.',
            },
            {
              kind: 'note',
              label: 'Privacidade',
              text: 'Nada passa por um servidor do Zylara. Os detalhes estão na [política de privacidade](/privacy).',
            },
          ],
        },
      ],
    },

    {
      slug: 'permissions',
      group: 'configure',
      title: 'Permissões',
      summary: 'Plano antes da escrita, aprovação por ferramenta e execução de código opt-in.',
      lede: 'O agente não age no escuro: ele planeja, pede aprovação e mostra o que mudou. Este é o contrato de permissões do app.',
      sections: [
        {
          id: 'plan-mode',
          title: 'Modo plano',
          blocks: [
            {
              kind: 'text',
              text: 'No modo plano o agente investiga e escreve um plano com os passos, os arquivos afetados e o risco de cada mudança. Nada é gravado até você aprovar.',
            },
            {
              kind: 'list',
              items: [
                'Aprovar o plano libera a execução; rejeitar devolve o agente para a investigação.',
                'O plano vale para o turno: mudou o escopo, um plano novo é pedido.',
                'Dá para sair do modo plano a qualquer momento e voltar para a conversa.',
              ],
            },
          ],
        },
        {
          id: 'approvals',
          title: 'Aprovações',
          blocks: [
            {
              kind: 'table',
              head: ['Ação', 'Comportamento'],
              rows: [
                ['Ler arquivos do workspace', 'Permitido no turno, com as leituras na timeline.'],
                ['Escrever ou editar arquivos', 'Pede aprovação e mostra o diff antes de aplicar.'],
                ['Rodar comandos', 'Pede aprovação; comando e diretório aparecem na solicitação.'],
                ['Busca na web e leitura de páginas', 'Só quando o agente julga necessário para a tarefa.'],
              ],
            },
          ],
        },
        {
          id: 'sandbox',
          title: 'Execução de código',
          blocks: [
            {
              kind: 'text',
              text: 'A execução de código é opt-in. Quando ligada, o agente escreve e roda scripts Python e Node em um workspace isolado, com timeout, limites e cancelamento — e entrega os arquivos gerados como artefatos.',
            },
            {
              kind: 'list',
              items: [
                'Nada roda fora do workspace do sandbox.',
                'Cancelar interrompe o processo em andamento.',
                'Os artefatos gerados vão para a Biblioteca e podem ser salvos como arquivo.',
              ],
            },
          ],
        },
        {
          id: 'review',
          title: 'Revisão',
          blocks: [
            {
              kind: 'text',
              text: 'Toda alteração aparece como diff no painel lateral, com arquivo, linhas adicionadas e removidas. O histórico local guarda o que foi aprovado, por conversa.',
            },
          ],
        },
      ],
    },

    {
      slug: 'troubleshooting',
      group: 'help',
      title: 'Solução de problemas',
      summary: 'O instalador não abre, o provedor não conecta, o AppImage não executa.',
      lede: 'Os problemas mais comuns dos primeiros minutos, com o que conferir antes de abrir uma issue.',
      sections: [
        {
          id: 'installer',
          title: 'O instalador não abre',
          blocks: [
            {
              kind: 'list',
              items: [
                'Confira o hash do arquivo contra o `SHA256SUMS.txt` da release: download incompleto é a causa mais comum.',
                'No Windows, o SmartScreen pede confirmação para instaladores novos — use “Mais informações” e confirme apenas se o hash bater.',
                'No macOS, abra o app com o botão direito → Abrir na primeira execução.',
              ],
            },
            {
              kind: 'note',
              label: 'Reinstalar',
              text: 'Desinstalar não apaga os dados: reinstalar sobre a mesma pasta mantém o histórico.',
            },
          ],
        },
        {
          id: 'provider',
          title: 'O provedor não conecta',
          blocks: [
            {
              kind: 'list',
              items: [
                'Confira se a chave foi colada por inteiro e se ela pertence ao mesmo provedor escolhido em Configurações → Provedores.',
                'Variáveis como `ANTHROPIC_API_KEY` são lidas ao abrir o app: depois de defini-las, reabra o Zylara.',
                'Com login ChatGPT, confirme que a conta tem plano elegível e que o limite do plano não estourou.',
              ],
            },
          ],
        },
        {
          id: 'linux',
          title: 'O AppImage não executa',
          blocks: [
            {
              kind: 'text',
              text: 'O AppImage precisa de permissão de execução. Se o sistema não montar via `FUSE`, rode com `--appimage-extract-and-run`.',
            },
            {
              kind: 'code',
              tabs: [
                {
                  label: 'Terminal',
                  code: 'chmod +x Zylara-*.AppImage\n./Zylara-*.AppImage --appimage-extract-and-run',
                },
              ],
            },
            {
              kind: 'text',
              text: 'Prefere pacote nativo? Use o `.deb` (Debian/Ubuntu) ou o `.rpm` (Fedora/openSUSE) da mesma release.',
            },
          ],
        },
        {
          id: 'report',
          title: 'Abrir uma issue',
          blocks: [
            {
              kind: 'text',
              text: 'Se nada acima resolver, abra uma issue com a versão do app, o sistema e o que aconteceu. Os passos para reproduzir ajudam mais que o print da tela.',
            },
            {
              kind: 'list',
              items: [
                '[Abrir uma issue](https://github.com/Hyska-Software/ZylaraAi/issues)',
                '[Versões publicadas](https://github.com/Hyska-Software/ZylaraAi/releases)',
                '[README do repositório](https://github.com/Hyska-Software/ZylaraAi#readme)',
              ],
            },
          ],
        },
      ],
    },
  ],
};
