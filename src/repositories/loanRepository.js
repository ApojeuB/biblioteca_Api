const Loan = require('../models/Loan');

class LoanRepository {
  async findAll(userId) {
    const filter = userId ? { user: userId } : {};
    return Loan.find(filter).populate('book').populate('user').sort({ createdAt: -1 });
  }

  async findById(id) {
    return Loan.findById(id).populate('book').populate('user');
  }

  async create(loanData) {
    return Loan.create(loanData);
  }

  async update(id, loanData) {
    return Loan.findByIdAndUpdate(id, loanData, {
      new: true,
      runValidators: true
    }).populate('book');
  }

  async countActiveByBook(bookId) {
    return Loan.countDocuments({ book: bookId, status: 'active' });
  }
}

module.exports = LoanRepository;
