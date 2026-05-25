const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const bookRoutes = require('./routes/bookRoutes');
const loanRoutes = require('./routes/loanRoutes');
const suggestionRoutes = require('./routes/suggestionRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/biblioteca';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Health check endpoint (não requer banco de dados)
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'ok',
    server: 'running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Rotas da API
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/loans', loanRoutes);
app.use('/suggestions', suggestionRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Rota nao encontrada.' });
});

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Erro interno do servidor.'
  });
});

// Configuração de reconexão automática do MongoDB
const mongooseOptions = {
  retryWrites: true,
  w: 'majority',
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Conectar ao MongoDB
console.log('📡 Tentando conectar ao MongoDB...');
console.log(`   URI: ${mongoUri.replace(/:[^:]*@/, ':****@')}`); // Mascarar senha nos logs

mongoose
  .connect(mongoUri, mongooseOptions)
  .then(() => {
    console.log('✅ Conectado ao MongoDB com sucesso!');
    
    // Iniciar servidor apenas após conexão bem-sucedida
    app.listen(port, () => {
      console.log(`🚀 Biblioteca API rodando na porta ${port}`);
      console.log(`📍 Acesse em http://localhost:${port}`);
      console.log(`💚 Health check: http://localhost:${port}/health`);
    });
  })
  .catch((error) => {
    console.error('❌ Erro ao conectar ao MongoDB:');
    console.error(`   Mensagem: ${error.message}`);
    console.error(`   Código: ${error.code}`);
    console.error('');
    console.error('💡 Dicas de resolução:');
    console.error('   1. Verifique se o MongoDB está rodando');
    console.error('   2. Verifique a string MONGODB_URI no arquivo .env');
    console.error('   3. Se usar MongoDB Atlas, verifique se seu IP está na whitelist');
    console.error('   4. Verifique as credenciais (usuário e senha)');
    console.error('');
    console.error(`   String configurada: ${mongoUri.replace(/:[^:]*@/, ':****@')}`);
    
    process.exit(1);
  });

// Tratamento de desconexão
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  Desconectado do MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('⚠️  Erro na conexão com MongoDB:', err.message);
});

module.exports = app;
