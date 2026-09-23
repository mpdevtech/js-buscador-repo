# PRD — Buscador de repositórios do GitHub

## 1. Visão geral

Aplicação web que permite pesquisar repositórios públicos do GitHub por palavra-chave e acessar rapidamente suas principais informações.

## 2. Objetivo

Oferecer uma busca simples e direta para que o usuário encontre repositórios relevantes sem precisar navegar pela interface do GitHub.

## 3. Escopo do MVP

O usuário deve conseguir:

- Digitar um termo em um campo de busca.
- Iniciar a pesquisa ao pressionar `Enter`.
- Visualizar até 10 repositórios relacionados ao termo, ordenados pelo número de estrelas.
- Abrir qualquer resultado diretamente no GitHub.



## 4. Funcionalidades e experiência do usuário



### 4.1. Busca

- A página deve apresentar um campo para a palavra-chave.
- A busca deve ser iniciada somente quando o usuário pressionar `Enter`.
- O termo informado deve ser usado para consultar repositórios no GitHub.



### 4.2. Resultados

Cada repositório encontrado deve ser apresentado em um card contendo:

- Foto do autor.
- Nome do autor.
- Nome do repositório.
- Descrição do repositório.
- Linguagem principal utilizada.
- Número de estrelas.
- Link direto para o repositório no GitHub.



### 4.3. Estados da interface

- **Carregamento:** enquanto a busca estiver em andamento, a interface deve indicar que os resultados estão sendo carregados.
- **Sem resultados:** quando nenhum repositório for encontrado, a interface deve exibir uma mensagem de estado vazio.
- **Erro:** se a busca falhar, a interface deve apresentar uma mensagem amigável, sem expor detalhes técnicos ao usuário.



### 4.4. Diretrizes visuais

- O campo de busca deve ficar dentro de um card com bordas arredondadas.
- Cada resultado deve ficar dentro de um card com bordas arredondadas.
- O fundo da página deve ser mais escuro que os cards.
- O conteúdo deve ficar centralizado na página.
- A área de conteúdo deve ter largura máxima de `700px`.



## 5. Critérios de aceite

- Ao digitar um termo e pressionar `Enter`, a aplicação inicia a busca.
- Outras interações com o campo, sem pressionar `Enter`, não iniciam a busca.
- Durante a requisição, o estado de carregamento fica visível.
- Em uma busca bem-sucedida, são exibidos no máximo 10 resultados ordenados por estrelas.
- Cada resultado apresenta todas as informações definidas na seção 4.2, quando disponíveis na API.
- O link de cada resultado direciona para o repositório correspondente no GitHub.
- Uma resposta sem itens exibe o estado vazio.
- Uma falha de rede ou resposta HTTP sem sucesso exibe o estado de erro.

## 6. Decisões técnicas

### 6.1. Integração com a API

Usar a API pública de busca de repositórios do GitHub:

```text
https://api.github.com/search/repositories?q={PALAVRA-CHAVE}&sort=stars&per_page=10
```

- Substituir `{PALAVRA-CHAVE}` pelo termo digitado pelo usuário, devidamente codificado para uso em URL.
- Usar `fetch` para realizar a requisição.
- Implementar a chamada com `async/await` dentro de um bloco `try/catch`.
- Verificar o status HTTP antes de processar a resposta.

### 6.2. Eventos

- Registrar todos os eventos por JavaScript.
- Não usar atributos de evento diretamente no HTML, como `onclick` ou `onkeydown`.

## 7. Fora do escopo inicial

Não há requisitos definidos para autenticação, paginação, filtros adicionais ou busca automática durante a digitação. Essas funcionalidades não fazem parte do MVP.