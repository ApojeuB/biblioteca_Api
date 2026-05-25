# 🚀 Guia de Configuração - Biblioteca API

Este documento fornece instruções passo a passo para configurar a aplicação com MongoDB.

## ⚡ Início Rápido

### Opção 1: MongoDB Local com Docker (Mais Fácil)

Se você tem **Docker** instalado no seu computador:

```bash
# 1. Abra o terminal na pasta do projeto
cd A:\Project\biblioteca-api

# 2. Suba o MongoDB com Docker Compose
docker compose up -d

# 3. Instale as dependências (primeira vez apenas)
npm install

# 4. Inicie a aplicação
npm run dev

# 5. Acesse a aplicação
# Abra o navegador em: http://localhost:3000
```

**Pronto!** A aplicação está rodando com MongoDB local.

---

### Opção 2: MongoDB Atlas (Nuvem - Sem Docker)

Se você **não tem Docker** ou prefere usar a nuvem:

#### Passo 1: Criar conta no MongoDB Atlas

1. Acesse [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Clique em **"Sign Up"** (ou faça login se já tiver conta)
3. Preencha os dados e confirme seu email

#### Passo 2: Criar um Cluster

1. Após fazer login, clique em **"Create"** para criar um novo projeto
2. Dê um nome ao projeto (ex: "Biblioteca")
3. Clique em **"Create Project"**
4. Clique em **"Create"** para criar um cluster
5. Escolha o plano **"Free"** (gratuito)
6. Escolha a região mais próxima de você
7. Clique em **"Create Cluster"** e aguarde (pode levar alguns minutos)

#### Passo 3: Configurar Acesso

1. No menu lateral, vá para **"Security"** > **"Network Access"**
2. Clique em **"Add IP Address"**
3. Clique em **"Allow Access from Anywhere"** (para desenvolvimento)
4. Clique em **"Confirm"**

#### Passo 4: Criar Usuário de Banco de Dados

1. No menu lateral, vá para **"Security"** > **"Database Access"**
2. Clique em **"Add New Database User"**
3. Escolha **"Password"** como método de autenticação
4. Digite um nome de usuário (ex: `biblioteca`)
5. Digite uma senha segura
6. Clique em **"Add User"**

#### Passo 5: Obter String de Conexão

1. Volte para a página principal do cluster
2. Clique em **"Connect"**
3. Escolha **"Drivers"**
4. Selecione **"Node.js"** como driver
5. Copie a string de conexão (ela terá este formato):
   ```
   mongodb+srv://seu-usuario:sua-senha@cluster0.xxxxx.mongodb.net/biblioteca?retryWrites=true&w=majority
   ```

#### Passo 6: Configurar a Aplicação

1. Abra o arquivo `.env` na pasta do projeto
2. Encontre a linha `MONGODB_URI=`
3. **Substitua a string inteira** pela que você copiou do MongoDB Atlas
4. **Importante:** Substitua `seu-usuario` e `sua-senha` pelos valores que você criou no Passo 4

Exemplo:
```env
# ANTES:
MONGODB_URI=mongodb://Mister:HelloWorldMisterOrths@localhost:27017/biblioteca?authSource=admin

# DEPOIS:
MONGODB_URI=mongodb+srv://biblioteca:sua-senha-aqui@cluster0.abc123.mongodb.net/biblioteca?retryWrites=true&w=majority
```

#### Passo 7: Rodar a Aplicação

```bash
# 1. Abra o terminal na pasta do projeto
cd A:\Project\biblioteca-api

# 2. Instale as dependências (primeira vez apenas)
npm install

# 3. Inicie a aplicação
npm run dev

# 4. Acesse a aplicação
# Abra o navegador em: http://localhost:3000
```

---

## ✅ Verificar se Tudo Está Funcionando

Após rodar a aplicação, você deve ver mensagens como:

```
📡 Tentando conectar ao MongoDB...
✅ Conectado ao MongoDB com sucesso!
🚀 Biblioteca API rodando na porta 3000
📍 Acesse em http://localhost:3000
💚 Health check: http://localhost:3000/health
```

Se ver uma mensagem de erro, veja a seção **Troubleshooting** abaixo.

---

## 🔧 Troubleshooting

### Erro: "Erro ao conectar ao MongoDB"

**Causa 1: Docker não está rodando (se usar Opção 1)**
```bash
# Verifique se o Docker está rodando
docker ps

# Se não estiver, suba o MongoDB novamente
docker compose up -d
```

**Causa 2: String de conexão incorreta (se usar Opção 2)**
- Verifique se copiou corretamente a string do MongoDB Atlas
- Certifique-se de que substituiu `seu-usuario` e `sua-senha`
- Verifique se não há espaços extras na string

**Causa 3: IP não está na whitelist (se usar Opção 2)**
- Vá para MongoDB Atlas > Security > Network Access
- Clique em "Add IP Address"
- Clique em "Allow Access from Anywhere"

### Erro: "ECONNREFUSED"

Significa que a aplicação não consegue conectar ao MongoDB.

**Se usar Docker:**
```bash
# Verifique se o container está rodando
docker ps

# Se não estiver, suba novamente
docker compose up -d

# Se ainda não funcionar, reinicie
docker compose down
docker compose up -d
```

**Se usar MongoDB Atlas:**
- Verifique se o cluster está ativo em MongoDB Atlas
- Verifique se sua internet está funcionando
- Verifique se o IP está na whitelist

### Erro: "Invalid credentials"

A senha ou usuário está incorreto.

**Se usar Docker:**
- Verifique o arquivo `.env` e certifique-se de que as credenciais correspondem ao `docker-compose.yml`

**Se usar MongoDB Atlas:**
- Vá para MongoDB Atlas > Security > Database Access
- Verifique o usuário e a senha que você criou
- Certifique-se de que a senha na string de conexão está correta (sem caracteres especiais não escapados)

---

## 📝 Notas Importantes

1. **Nunca commite o arquivo `.env` no Git** - ele contém credenciais sensíveis
2. **Se usar MongoDB Atlas em produção**, certifique-se de usar uma senha forte
3. **O arquivo `.env.example`** mostra a estrutura esperada (sem valores sensíveis)
4. **Para desenvolvimento**, você pode usar o MongoDB local com Docker
5. **Para produção**, recomenda-se usar MongoDB Atlas ou um serviço gerenciado

---

## 🎯 Próximos Passos

Após a aplicação estar rodando:

1. Acesse `http://localhost:3000` para ver o frontend
2. Registre uma conta de usuário
3. Adicione alguns livros
4. Teste as funcionalidades de empréstimo

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique o console da aplicação para mensagens de erro
2. Visite `http://localhost:3000/health` para ver o status
3. Consulte o arquivo `README.md` para mais informações sobre as rotas da API
