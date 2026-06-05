const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/userRepository');

class AuthService {
  constructor(userRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  getJwtSecret() {
    return process.env.JWT_SECRET || 'biblioteca-dev-secret';
  }

  signToken(user) {
    return jwt.sign(
      {
        sub: user.id,
        email: user.email
      },
      this.getJwtSecret(),
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      }
    );
  }

  serializeUser(user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email
    };
  }

  async register(userData) {
    const email = String(userData.email || '').trim().toLowerCase();
    const password = String(userData.password || '');
    const name = String(userData.name || '').trim();

    if (!name || !email || !password) {
      const error = new Error('Nome, email e senha sao obrigatorios.');
      error.status = 400;
      throw error;
    }

    if (password.length < 4) {
      const error = new Error('Senha deve ter pelo menos 4 caracteres.');
      error.status = 400;
      throw error;
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('Ja existe uma conta com este email.');
      error.status = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({
      name,
      email,
      passwordHash
    });

    return {
      user: this.serializeUser(user),
      token: this.signToken(user)
    };
  }

  async login(credentials) {
    const email = String(credentials.email || '').trim().toLowerCase();
    const password = String(credentials.password || '');

    const user = await this.userRepository.findByEmail(email, true);
    if (!user) {
      const error = new Error('Email ou senha invalidos.');
      error.status = 401;
      throw error;
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      const error = new Error('Email ou senha invalidos.');
      error.status = 401;
      throw error;
    }

    return {
      user: this.serializeUser(user),
      token: this.signToken(user)
    };
  }

  async getProfile(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      const error = new Error('Usuario nao encontrado.');
      error.status = 404;
      throw error;
    }

    return this.serializeUser(user);
  }
}

module.exports = AuthService;
