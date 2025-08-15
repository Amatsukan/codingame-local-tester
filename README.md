
CodinGame Local Tester
======================

[![NPM Version](https://img.shields.io/npm/v/codingame-local-tester.svg)](https://www.npmjs.com/package/@amatsukan/codingame-local-tester)

Uma ferramenta de linha de comando para testar suas soluções de quebra-cabeças do CodinGame localmente. `codingame-local-tester` executa seu código JavaScript contra um conjunto de casos de teste, simulando o ambiente da plataforma e fornecendo feedback instantâneo.

Recursos
--------

* **Teste Localmente**: Desenvolva e teste suas soluções sem precisar enviá-las para a plataforma CodinGame a cada alteração.
* **Execução Isolada**: Cada caso de teste executa sua solução em um processo separado e isolado, evitando efeitos colaterais entre os testes.
* **E/S Automatizada**: A ferramenta lida automaticamente com a injeção de `input` através de um `readline()` mockado e captura a saída do `console.log()` para verificação.
* **Configuração Simples**: Um único arquivo de configuração para apontar para sua solução e seus testes.
* **Feedback Rápido**: Obtenha resultados claros de aprovação/reprovação para cada caso de teste diretamente no seu terminal.

Instalação
----------

Você pode instalar o pacote de duas maneiras:

### Globalmente (Recomendado)

Uma instalação global permite que você execute o comando `codingame-local-tester` em qualquer pasta.

```
npm install -g @amatsukan/codingame-local-tester
```

### Localmente

Você também pode instalá-lo como uma dependência de desenvolvimento em seu projeto.

```
npm install --save-dev @amatsukan/codingame-local-tester
```

Nesse caso, você pode executar a ferramenta via `npx codingame-local-tester` ou adicionando um script ao seu `package.json`.

Como Usar
---------

A ferramenta executa seu script de solução contra múltiplos arquivos de casos de teste. Para cada caso, ela fornecerá a entrada especificada via `readline()` e comparará a saída do seu script (via `console.log()`) com a `expectedOutput` correspondente.

### 1. Estruture Seu Projeto

Crie uma pasta para o seu quebra-cabeça com a seguinte estrutura:

```
my-puzzle/
├── solution.js
├── test-cases/
│   ├── 1.js
│   └── 2.js
└── codingame-workspace.config.js
```

### 2. Escreva Sua Solução (solution.js)

Escreva seu código como faria na plataforma CodinGame, usando `readline()` para ler a entrada e `console.log()` para imprimir a saída.

**Exemplo: `solution.js`**

```
// Este código lê duas linhas de entrada,
// soma os números e imprime o resultado.
const n1 = parseInt(readline());
const n2 = parseInt(readline());

console.log(n1 + n2);
```

### 3. Crie os Casos de Teste

Dentro da pasta de casos de teste, crie arquivos `.js`. Cada arquivo representa um caso de teste e **deve exportar um objeto** contendo as propriedades `input` e `expectedOutput`.

**Exemplo: `test-cases/1.js`**

```
const input = `10\n5`;
const expectedOutput = `15`;

module.exports = { input, expectedOutput };
```

> **Nota**: Tanto `input` quanto `expectedOutput` devem ser strings. Para múltiplas linhas, use o caractere de nova linha (`\n`).

### 4. Crie o Arquivo de Configuração

Na raiz do seu projeto, crie o arquivo `codingame-workspace.config.js`. Este arquivo informa à ferramenta onde encontrar sua solução e os casos de teste.

**Exemplo: `codingame-workspace.config.js`**

```
module.exports = {
  // Caminho para o seu arquivo de solução principal
  solution_main_file: 'solution.js',

  // Caminho para a pasta contendo os arquivos de caso de teste
  cases_folder: 'test-cases'
};
```

### 5. Execute os Testes

Abra o terminal na pasta raiz do seu projeto (`my-puzzle/`) e execute o comando:

Se instalado globalmente:

```
codingame-local-tester
```

Se instalado como dependência de desenvolvimento:

```
npx codingame-local-tester
```

A ferramenta executará sua solução para cada caso de teste e exibirá os resultados diretamente no terminal.

API Programática
----------------

Além da CLI, você pode usar o `codingame-local-tester` programaticamente.

```
const tester = require('codingame-local-tester');

// A função 'run' encapsula a lógica principal da CLI.
// Ela encontra e usa automaticamente o 'codingame-workspace.config.js'.
try {
  await tester.run();
} catch (error) {
  console.error('Ocorreu um erro:', error.message);
}
```

Licença
-------

Este projeto está licenciado sob a Licença ISC.