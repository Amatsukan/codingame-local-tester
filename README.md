# CodinGame Local Tester

[![NPM Version](https://img.shields.io/npm/v/codingame-local-tester.svg)](https://www.npmjs.com/package/codingame-local-tester)

Uma ferramenta de linha de comando para testar suas soluções de quebra-cabeças do CodinGame localmente. O `codingame-local-tester` executa seu código JavaScript contra um conjunto de casos de teste, simulando o ambiente da plataforma e fornecendo feedback instantâneo usando o Jest.

## Funcionalidades

-   **Teste Localmente**: Desenvolva e teste suas soluções sem a necessidade de enviá-las para a plataforma CodinGame a cada alteração.
-   **Testes de I/O Automatizados**: Defina casos de teste como módulos JavaScript simples. A ferramenta cuida de injetar a entrada (`readline`) e capturar a saída (`console.log`).
-   **Configuração Simples**: Um único arquivo de configuração para apontar para sua solução e seus testes.
-   **Feedback Rápido**: Obtenha resultados claros de aprovação/reprovação do Jest para cada caso de teste.

## Instalação

Você pode instalar o pacote de duas maneiras:

### Globalmente (Recomendado)
A instalação global permite que você execute o comando `codingame-local-tester` em qualquer pasta.
```bash
npm install -g codingame-local-tester
```

### Localmente
Você também pode instalá-lo como uma dependência de desenvolvimento em seu projeto.
```bash
npm install --save-dev codingame-local-tester
```
Nesse caso, você pode executar a ferramenta via `npx codingame-local-tester` ou adicionando um script ao seu `package.json`.

## Como Usar

A ferramenta executa seu script de solução contra múltiplos arquivos de caso de teste. Para cada caso, ela fornecerá o `input` especificado via `readline()` e comparará a saída do seu script (via `console.log()`) com o `expectedOutput` correspondente.

### 1. Estruture seu Projeto

Crie uma pasta para o seu quebra-cabeça com a seguinte estrutura:

```
meu-puzzle/
├── solution.js
├── test-cases/
│   ├── 1.js
│   └── 2.js
└── codingame-workspace.config.js
```

### 2. Escreva sua Solução (`solution.js`)

Escreva seu código como faria na plataforma CodinGame, usando `readline()` para ler a entrada e `console.log()` para imprimir a saída.

**Exemplo: `solution.js`**
```javascript
// Este código lê duas linhas da entrada,
// soma os números e imprime o resultado.
const n1 = parseInt(readline());
const n2 = parseInt(readline());

console.log(n1 + n2);
```

### 3. Crie os Casos de Teste

Dentro da pasta de casos de teste, crie arquivos `.js`. Cada arquivo representa um caso de teste e **deve exportar um objeto** contendo as propriedades `input` e `expectedOutput`.

**Exemplo: `test-cases/1.js`**
```javascript
const input = `10\n5`;
const expectedOutput = `15`;

module.exports = { input, expectedOutput };
```
> **Nota**: Tanto `input` quanto `expectedOutput` devem ser strings. Para múltiplas linhas, use o caractere de nova linha (`\n`).

### 4. Crie o Arquivo de Configuração

Na raiz do seu projeto, crie o arquivo `codingame-workspace.config.js`. Este arquivo informa à ferramenta onde encontrar sua solução e seus casos de teste.

**Exemplo: `codingame-workspace.config.js`**
```javascript
module.exports = {
  // Caminho para o seu arquivo de solução principal
  solution_main_file: 'solution.js',

  // Caminho para a pasta que contém os arquivos de caso de teste
  cases_folder: 'test-cases'
};
```

### 5. Execute os Testes

Abra o terminal na pasta raiz do seu projeto (`meu-puzzle/`) e execute o comando:

```bash
codingame-local-tester
```

A ferramenta irá iniciar o Jest, que executará cada caso de teste e mostrará os resultados.

## Licença

Este projeto está licenciado sob a Licença ISC.