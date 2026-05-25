# 🗺️ Próximos Passos: Conectar e Testar sua Aplicação

Agora que o projeto está organizado e o Git configurado, siga este roteiro para colocar tudo para funcionar.

---

## 1️⃣ Conexão com o MongoDB

Você tem duas opções principais:

### Opção A: MongoDB Atlas (Nuvem - Recomendado)
1.  Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Crie um Cluster gratuito.
3.  Em **Database Access**, crie um usuário e senha.
4.  Em **Network Access**, adicione seu IP atual (ou selecione "Allow access from anywhere").
5.  Clique em **Connect** > **Drivers** e copie a string de conexão.
6.  No seu arquivo `.env`, cole a string em `MONGODB_URI`:
    `MONGODB_URI=mongodb+srv://usuario:senha@cluster.xxxx.mongodb.net/biblioteca?retryWrites=true&w=majority`

### Opção B: Docker (Local)
1.  Certifique-se de que o Docker Desktop está rodando.
2.  No terminal, na pasta do projeto, execute:
    `docker compose up -d`
3.  O `.env` já vem configurado para essa opção por padrão.

---

## 2️⃣ Iniciando a Aplicação

Com o banco configurado, abra o terminal na pasta do projeto e execute:

```bash
# Instalar as dependências (se ainda não fez)
npm install

# Rodar em modo de desenvolvimento
npm run dev
```

Você deverá ver a mensagem: 
`✅ Conectado ao MongoDB com sucesso!`
`🚀 Biblioteca API rodando na porta 3000`

---

## 3️⃣ Testando o Formato Web

A aplicação já serve o frontend automaticamente. Para testar:

1.  **Acesse no Navegador**: Abra [http://localhost:3000](http://localhost:3000).
2.  **Health Check**: Verifique [http://localhost:3000/health](http://localhost:3000/health). Deve retornar `status: "ok"` e `database: "connected"`.
3.  **Frontend**: 
    - Tente se registrar na tela de login.
    - Tente cadastrar um livro.
    - Verifique se a lista de livros aparece na página inicial.

---

## 4️⃣ Fazendo o Push para o GitHub

Como o commit já está pronto, basta enviar para o seu repositório:

```bash
# 1. Vincular ao seu repositório (se ainda não fez)
git remote add origin https://github.com/ApojeuB/biblioteca_Api.git

# 2. Garantir que está na branch principal
git branch -M main

# 3. Enviar os arquivos
git push -u origin main
```
*O terminal pedirá seu usuário do GitHub e o seu Personal Access Token (PAT).*

---

## 🛠️ Dicas de Ouro

- **Logs**: Fique de olho no terminal onde o `npm run dev` está rodando. Qualquer erro de conexão aparecerá lá com dicas de como resolver.
- **Segurança**: O `.gitignore` agora protege seu arquivo `.env`. Nunca remova a linha `.env` do gitignore para evitar vazar suas senhas.
- **Novos Livros**: Você pode usar o script de seed para popular o banco rapidamente:
  `npm run seed:books -- "caminho/para/seu/arquivo.json"`

Boa sorte com seu projeto! 🚀
