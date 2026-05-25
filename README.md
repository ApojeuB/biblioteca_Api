# Biblioteca API

API REST para gerenciamento de livros e emprestimos em uma biblioteca, usando Node.js, Express, MongoDB e Mongoose.

## Estrutura

```text
biblioteca-api/
|-- src/
|   |-- controllers/
|   |-- services/
|   |-- repositories/
|   |-- models/
|   |-- routes/
|   `-- app.js
|-- scripts/
|   `-- seedBooks.js
|-- .env.example
|-- docker-compose.yml
|-- package.json
`-- README.md
```

## Como rodar

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure o arquivo `.env`

O arquivo `.env` já está preparado com instruções. Você precisa apenas **alterar a variável `MONGODB_URI`** com sua string de conexão do MongoDB.

#### Opções de MongoDB:

**A) MongoDB Local (via Docker)**

Se você tem Docker instalado, suba o MongoDB com:

```bash
docker compose up -d
```

Então use a URI padrão:
```env
MONGODB_URI=mongodb://Mister:HelloWorldMisterOrths@localhost:27017/biblioteca?authSource=admin
```

**B) MongoDB Atlas (Nuvem - Recomendado)**

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie uma conta gratuita
3. Crie um novo cluster
4. Adicione seu IP à lista de acesso (IP Whitelist)
5. Crie um usuário de banco de dados
6. Clique em "Connect" e copie a string de conexão
7. Cole a string no arquivo `.env` na variável `MONGODB_URI`

Exemplo de URI do Atlas:
```env
MONGODB_URI=mongodb+srv://seu-usuario:sua-senha@cluster0.xxxxx.mongodb.net/biblioteca?retryWrites=true&w=majority
```

### 3. Inicie a API

**Modo desenvolvimento (com auto-reload):**
```bash
npm run dev
```

**Modo produção:**
```bash
npm start
```

A API ficará disponível em `http://localhost:3000`.

### 4. (Opcional) Importe livros

Para importar um arquivo JSON no formato de `books.json`, rode:

```bash
npm run seed:books -- "C:/Users/user/Downloads/books.json"
```

## Frontend

O front-end fica disponível no mesmo endereço:

```text
http://localhost:3000
```

Ele permite:
- Consultar o catálogo de livros
- Alugar livros
- Registrar devoluções
- Cadastrar novos livros
- Criar uma sessão local de login/registro
- Enviar sugestões para a API

## Rotas da API

### Health check

```http
GET /health
```

Retorna o status do servidor e da conexão com o banco de dados.

### Autenticação

```http
POST /auth/register
POST /auth/login
GET /auth/me
```

Exemplo para registrar:

```json
{
  "name": "Maria Silva",
  "email": "maria@example.com",
  "password": "1234"
}
```

As rotas protegidas usam JWT no cabeçalho:

```http
Authorization: Bearer TOKEN
```

### Livros

```http
GET /books
GET /books/:id
POST /books
PUT /books/:id
DELETE /books/:id
```

Criar, atualizar e remover livros exigem autenticação.

Exemplo para criar livro:

```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "9780132350884",
  "quantity": 3
}
```

O cadastro também aceita os campos `country`, `language`, `pages`, `year`, `imageLink` e `link`.

### Empréstimos

```http
GET /loans
GET /loans/:id
POST /loans
PATCH /loans/:id/return
```

Todas as rotas de empréstimos exigem autenticação. Cada usuário lista e devolve apenas os próprios empréstimos.

Exemplo para criar empréstimo:

```json
{
  "book": "ID_DO_LIVRO",
  "borrowerName": "Maria Silva",
  "dueDate": "2026-06-07"
}
```

### Sugestões

```http
GET /suggestions
POST /suggestions
```

As rotas de sugestões exigem autenticação.

Exemplo para enviar sugestão:

```json
{
  "name": "Maria Silva",
  "email": "maria@example.com",
  "message": "Seria bom adicionar busca por autor."
}
```

A sugestão sempre fica salva no MongoDB. Se as variáveis `SMTP_*` estiverem configuradas, a API também envia a mensagem para `SUGGESTION_TO_EMAIL`.

## Regras implementadas

- Não permite cadastrar dois livros com o mesmo ISBN.
- Ao criar empréstimo, reduz a quantidade disponível do livro.
- Não permite emprestar livro sem disponibilidade.
- Ao devolver empréstimo, aumenta a quantidade disponível do livro.
- Não permite remover livro com empréstimos ativos.
- Não permite reduzir a quantidade total abaixo dos empréstimos ativos.
- Valida IDs inválidos antes de consultar o MongoDB.
- Usa atualização atômica para reservar estoque ao criar empréstimos.
- Salva sugestões e envia por email quando o SMTP está configurado.
- Registra usuários, faz login com JWT e protege rotas de escrita.

## Troubleshooting

### Erro: "Erro ao conectar ao MongoDB"

1. **Verifique a string `MONGODB_URI`** no arquivo `.env`
2. **Se usar MongoDB local:** Certifique-se de que o Docker está rodando (`docker compose up -d`)
3. **Se usar MongoDB Atlas:** 
   - Verifique se seu IP está na whitelist
   - Verifique as credenciais (usuário e senha)
   - Certifique-se de que o cluster está ativo
4. **Teste a conexão** visitando `http://localhost:3000/health`

### Erro: "ECONNREFUSED"

Significa que a aplicação não consegue conectar ao MongoDB. Verifique:
- Se o MongoDB está rodando
- Se a string de conexão está correta
- Se as credenciais estão corretas
