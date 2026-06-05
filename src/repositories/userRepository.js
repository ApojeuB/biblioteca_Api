const User = require('../models/User');

class UserRepository {
  async findByEmail(email, includePassword = false) {
    const query = User.findOne({ email });
    return includePassword ? query.select('+passwordHash') : query;
  }

  async findById(id) {
    return User.findById(id);
  }

  async create(userData) {
    return User.create(userData);
  }
}

module.exports = UserRepository;
