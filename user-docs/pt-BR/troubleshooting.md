---
title: Solução de problemas
description: Resolva problemas comuns com provedores, modelos, streaming, arquivos, execução de código, Docker, plugins e atualizações.
---

Comece pela mensagem que o app mostrou. A maioria das falhas nomeia o provedor, a ferramenta ou o
arquivo envolvido, e a correção está a uma configuração de distância.

## Provedores e credenciais

| Sintoma | Causa | Correção |
| --- | --- | --- |
| Aviso no campo de mensagem pedindo um provedor | Nenhuma credencial configurada | **Abrir provedores** e adicionar uma chave, ou entrar com o ChatGPT |
| "Nenhuma chave de API para *provedor*" | O modelo selecionado é de um provedor não conectado | Conecte-o em **Configurações → Provedores**, ou escolha um modelo de um provedor que você já tem |
| 401 / não autorizado | Chave errada, expirada ou revogada | Cole a chave de novo e use **Testar conexão** |
| 403 em um modelo | Sua conta não tem acesso a esse modelo | Escolha outro modelo ou faça upgrade no plano do provedor |
| "Sessão do ChatGPT expirada" | A sessão OAuth terminou | **Reconectar** em **Configurações → Provedores → OpenAI** |

Variáveis de ambiente e um login existente da CLI do OpenCode são usados automaticamente; o selo ao
lado do provedor indica qual origem está ativa.

## Modelos e respostas

| Sintoma | Causa | Correção |
| --- | --- | --- |
| Modelo marcado como **Indisponível** | O provedor o removeu, ou sua conta não pode usá-lo | Escolha outro modelo |
| Pílula do modelo desativada | Um turno está rodando | Pare a resposta ou espere |
| A resposta para no meio da frase | Limite do provedor, janela de contexto ou queda de rede | Tente de novo, ou comece uma conversa nova |
| Bloco de raciocínio vazio | O modelo não faz streaming do raciocínio | É normal; confira os detalhes do modelo |
| A resposta ignora um anexo | Modelo sem visão, ou anexos desativados | Use o filtro **Visão** e ative **Enviar anexos ao modelo** |
| Os custos parecem errados | Os preços vêm do catálogo, não da fatura | Use o console do provedor como fonte da verdade |

## Streaming e turnos

| Sintoma | Correção |
| --- | --- |
| O turno nunca começa | Confira o selo do provedor; rode **Testar conexão** |
| Silêncio longo antes do primeiro token | Aumente **Timeout do primeiro token** em **Configurações → Provedores → Confiabilidade** |
| Travado depois de uma mudança de rede | Pare o turno e envie de novo; o texto parcial é preservado |
| "Contexto compactado" aparece sempre | Aumente o **Limite de auto-compactação** ou comece uma conversa nova |
| Sessão em segundo plano terminou sem resposta | Abra a sessão; as notificações estão em **Configurações → Agentes → Notificações** |

## Arquivos, artefatos e a Biblioteca

| Sintoma | Correção |
| --- | --- |
| Nenhum card de artefato | Ative **Criar arquivos** no campo de mensagem; confirme que o modelo suporta chamadas de ferramenta |
| PDF/DOCX/XLSX não foram gerados | Ative a **Execução de código** e instale Python ou Node |
| A prévia diz que não está disponível | Use **Salvar como…** e abra o arquivo no app do sistema |
| A prévia de Office parece simples | É o esperado: as prévias são estruturais, sem cores nem células mescladas |
| A Biblioteca não mostra nada | Limpe os filtros; confira se a conversa não foi excluída |
| PDF digitalizado não devolve texto | Não há OCR; converta o arquivo para texto antes |

## Execução de código

| Sintoma | Correção |
| --- | --- |
| "A execução de código está desativada" | **Configurações → Ferramentas → Execução de código → Permitir execução de código** |
| "Python não encontrado" / "Node não encontrado" | Instale o interpretador ou defina o caminho, depois **Verificar de novo** |
| "Tempo esgotado" | Simplifique o script ou aumente o **Timeout de execução** |
| "Limite de saída excedido" | Grave os resultados em um arquivo em vez de imprimi-los |
| O script termina com código diferente de zero | Leia a saída do console no resultado da ferramenta; os artefatos produzidos antes do erro são mantidos |

## Docker, sandbox e uso do computador

| Sintoma | Correção |
| --- | --- |
| Docker não encontrado | Instale Docker Desktop/Engine e pressione **Iniciar Docker** |
| O sandbox de comandos não inicia | **Validar imagem**, depois **Baixar imagem**; confira o nome da imagem |
| Um contêiner continua rodando | **Limpar contêineres** em **Configurações → Ferramentas** ou **Configurações → Agentes** |
| A aba Tela está preta | **Diagnóstico** nas configurações de desktop privado; reinicie o contêiner |
| As ações de uso do computador são negadas | Aprove o card, ou conceda a capacidade ao agente |
| O teclado ficou preso ao assumir o controle | Pressione `Ctrl+Alt+Shift+Q` |

## Plugins

| Sintoma | Correção |
| --- | --- |
| O app não inicia depois de instalar um plugin | Inicie em **Modo seguro** ou com `--disable-plugins`, e então remova o plugin |
| A interface do plugin desapareceu | **Configurações → Design → Ativar interface de plugins** |
| A instalação foi rejeitada | Confira a assinatura, o hash e as permissões pedidas; HTTPS é obrigatório |
| O plugin está instalado mas inativo | Plugins instalados por agente chegam desativados; ative você mesmo |
| A atualização falha | Volte à versão anterior e tente de novo |

## Atualizações

| Sintoma | Correção |
| --- | --- |
| Nenhum aviso de atualização | **Configurações → Sobre → Verificar agora**; só releases estáveis |
| A versão foi pulada | Uma versão mais nova sobrepõe **Pular esta versão**; verifique de novo |
| O download falha | Confira a rede e o espaço livre; o arquivo parcial é descartado |
| Falta "Instalar e reiniciar" | Só instalações gerenciadas (script de Linux x64/macOS arm64) suportam; caso contrário, abra o pacote baixado |
| Hash não confere | Não instale; baixe de novo pela página da release |

## Desempenho

| Sintoma | Correção |
| --- | --- |
| O app fica lento com conversas longas | Comece uma conversa nova; ative a auto-compactação mais cedo |
| Taxa de acerto do cache baixa | Mantenha o prompt do sistema e o conjunto de ferramentas estáveis; veja **Diagnóstico de cache** para o motivo da quebra |
| Memória alta depois de muitos artefatos | Feche as prévias; PDFs e vídeos grandes ficam retidos pelo painel |
| Ruído de ventoinha durante um turno | Modelos de raciocínio usam a CPU/GPU do provedor, não a sua; a carga local vem das prévias |

## FAQ

**O Zylara precisa de conta?** Não. Você conecta um provedor; não existe login do Zylara.

**Dá para usar offline?** O app abre e seu histórico é local, mas as respostas dependem do provedor.
A busca na web é o único recurso que conversa com um mecanismo de busca.

**Onde ficam minhas chaves de API?** Em `secrets.json`, na pasta de dados, lidas apenas pelo
backend. Veja [Dados e privacidade](/docs/data-and-privacy#credenciais).

**Perco minhas conversas se desinstalar?** Não, a menos que você escolha **Remover também meus
dados** ou `--purge`.

**O agente pode commitar sem mim?** Não. Ele pode editar e rodar comandos dentro do modo de
permissão, mas preparar, commitar e enviar são manuais.

**Por que um modelo se comporta diferente no Código?** Sessões de Código usam outro perfil:
ferramentas de arquivo, shell e git, um prompt de programação e um medidor de contexto. Veja
[Workspaces e sessões](/docs/code-workspaces).
