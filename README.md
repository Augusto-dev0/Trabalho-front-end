# Biblioteca Comunitária - Front-end

Projeto em grupo desenvolvido no curso de Ciência da Computação da Uninassau Maceió.

## Integrantes

1. Jailton dos Santos
2. Luiz Augusto
3. Luis Felipe
4. Darlan Lima
5. Pedro Henrique

## Sobre o projeto

Este repositório contém a parte visual (front-end) de um sistema para gerenciar o acervo de uma biblioteca comunitária. A aplicação não guarda dados por conta própria: ela conversa com uma API REST (o back-end) e mostra na tela o que a API devolve.

Por enquanto o sistema cobre três cadastros: **categorias**, **autores** e **editoras**. Os três têm as mesmas operações (listar, buscar, criar, editar e excluir), e o código foi feito para que isso fosse escrito uma vez só e reaproveitado nas três telas.

## O que dá para fazer no sistema

- Listar os registros, 10 por página
- Buscar por nome
- Ordenar por nome, de A a Z ou de Z a A
- Cadastrar um novo registro
- Editar um registro existente
- Excluir um registro, com uma confirmação antes
- Ver, embaixo de cada campo, os erros de validação que a API devolver
- Ver uma mensagem clara quando algo dá errado (API fora do ar, registro não encontrado, categoria que não pode ser apagada porque já tem livros, etc.)

Campos de cada cadastro:

| Cadastro   | Campos                                                   |
| ---------- | -------------------------------------------------------- |
| Categorias | nome, descrição                                          |
| Autores    | nome, nacionalidade, biografia                           |
| Editoras   | nome, e-mail, CNPJ (14 dígitos), telefone (DDD + número) |

## Tecnologias usadas

- React 19
- React Router 7 (navegação entre as telas)
- Vite 8 (servidor de desenvolvimento e build)
- Oxlint (verificação de código)

## Como rodar

### O que precisa estar instalado

- Node.js na versão 20.19 ou superior (ou 22.12 ou superior). Com versões mais antigas o Vite não inicia.
- npm, que já vem junto com o Node.
- O back-end da biblioteca rodando em `http://localhost:8080`. Sem ele a tela abre, mas as listas ficam vazias e aparece a mensagem de erro de conexão.

Para ver as versões instaladas:

```bash
node -v
npm -v
```

### Passo a passo

1. Clone o repositório (ou extraia o `.zip`, se recebeu assim) e entre na pasta:

```bash
git clone https://github.com/Augusto-dev0/Trabalho-front-end.git
cd biblioteca-front
```

2. Instale as dependências:

```bash
npm install
```

3. Deixe o back-end rodando na porta 8080.

4. Inicie o front-end:

```bash
npm run dev
```

5. Abra no navegador o endereço que aparecer no terminal, normalmente `http://localhost:5173`.

Em desenvolvimento não precisa configurar nada. O Vite pega todas as chamadas que começam com `/api` e repassa para `http://localhost:8080`, então não tem problema de CORS.

### Outros comandos

| Comando           | Para que serve                             |
| ----------------- | ------------------------------------------ |
| `npm run dev`     | Roda o projeto em modo de desenvolvimento  |
| `npm run build`   | Gera a versão final na pasta `dist/`       |
| `npm run preview` | Abre localmente a versão gerada pelo build |
| `npm run lint`    | Procura problemas no código                |

## Configuração para produção

O endereço da API vem da variável `VITE_API_URL`. Em desenvolvimento ela fica vazia. Para gerar o build apontando para uma API real, copie o `.env.example` para `.env` e preencha:

```env
VITE_API_URL=http://localhost:8080
```

Nesse caso o back-end precisa liberar CORS para o endereço onde o front estiver hospedado.

## Rotas da API usadas

Para cada recurso (`categorias`, `autores` e `editoras`) o front chama as mesmas cinco rotas:

| Método | Rota                                 | O que faz            |
| ------ | ------------------------------------ | -------------------- |
| GET    | `/{recurso}?nome=&page=&size=&sort=` | Lista com paginação  |
| GET    | `/{recurso}/{id}`                    | Busca um registro    |
| POST   | `/{recurso}`                         | Cria um registro     |
| PUT    | `/{recurso}/{id}`                    | Atualiza um registro |
| DELETE | `/{recurso}/{id}`                    | Exclui um registro   |

## Estrutura de pastas

```
biblioteca-front/
├── public/                  favicon e ícones
├── src/
│   ├── api/
│   │   ├── http.js          cliente HTTP único (URL base, token, tratamento de erro)
│   │   └── recursos.js      gera as cinco chamadas de CRUD para cada recurso
│   ├── components/
│   │   ├── Layout.jsx       cabeçalho e menu
│   │   ├── RecursoPage.jsx  tela de CRUD reutilizável
│   │   ├── Campo.jsx        campo de formulário
│   │   └── Paginacao.jsx    botões de paginação
│   ├── pages/
│   │   ├── CategoriasPage.jsx
│   │   ├── AutoresPage.jsx
│   │   └── EditorasPage.jsx
│   ├── App.jsx              rotas
│   ├── main.jsx             ponto de entrada
│   └── styles.css           estilos
├── .env.example             modelo de variáveis de ambiente
├── vite.config.js           configuração do Vite e proxy da API
└── package.json
```

A ideia central é o componente `RecursoPage`. Ele faz a listagem, a busca, a ordenação, a paginação e o formulário. Cada página (Categorias, Autores, Editoras) só diz qual API usar, quais colunas mostrar e quais campos o formulário tem. Por isso criar um cadastro novo dá pouco trabalho:

1. Em `src/api/recursos.js`, criar a API do recurso, por exemplo `export const livrosApi = criarRecurso('livros')`
2. Criar `src/pages/LivrosPage.jsx` copiando o formato de `CategoriasPage.jsx`
3. Registrar a rota em `src/App.jsx`
4. Colocar o link no menu em `src/components/Layout.jsx`

## Problemas comuns

- **"Não foi possível conectar à API":** o back-end não está rodando. Suba ele na porta 8080.
- **Erro no `npm install` ou o Vite não inicia:** confira a versão do Node (`node -v`).
- **Erro de CORS depois do build:** a `VITE_API_URL` aponta para uma origem que o back-end não liberou.
- **Porta 5173 ocupada:** o Vite escolhe outra porta sozinho. Use a que aparecer no terminal.

## O que ainda falta

O cliente HTTP já envia o token JWT no cabeçalho `Authorization` quando existe um guardado, mas ainda não há tela de login. A autenticação fica como próximo passo.
