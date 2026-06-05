const BookRepository = require('../repositories/bookRepository');
const LoanRepository = require('../repositories/loanRepository');
const mongoose = require('mongoose');
const UserRepository = require('../repositories/userRepository');

class LoanService {
  constructor(
    loanRepository = new LoanRepository(),
    bookRepository = new BookRepository(),
    userRepository = new UserRepository()
  ) {
    this.loanRepository = loanRepository;
    this.bookRepository = bookRepository;
    this.userRepository = userRepository;
  }

  async listLoans(authenticatedUser) {
    return this.loanRepository.findAll(authenticatedUser?.id);
  }

  ensureLoanBelongsToUser(loan, authenticatedUser) {
    if (!authenticatedUser || !loan.user) {
      return;
    }

    if (loan.user.id !== authenticatedUser.id) {
      const error = new Error('Voce nao tem permissao para acessar este emprestimo.');
      error.status = 403;
      throw error;
    }
  }

  async getLoanById(id, authenticatedUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error('ID de emprestimo invalido.');
      error.status = 400;
      throw error;
    }

    const loan = await this.loanRepository.findById(id);

    if (!loan) {
      const error = new Error('Emprestimo nao encontrado.');
      error.status = 404;
      throw error;
    }

    this.ensureLoanBelongsToUser(loan, authenticatedUser);

    return loan;
  }

  async createLoan(loanData, authenticatedUser) {
    if (!mongoose.Types.ObjectId.isValid(loanData.book)) {
      const error = new Error('ID de livro invalido.');
      error.status = 400;
      throw error;
    }

    const user = authenticatedUser
      ? await this.userRepository.findById(authenticatedUser.id)
      : null;

    if (!user) {
      const error = new Error('Usuario autenticado nao encontrado.');
      error.status = 401;
      throw error;
    }

    const book = await this.bookRepository.findById(loanData.book);

    if (!book) {
      const error = new Error('Livro nao encontrado.');
      error.status = 404;
      throw error;
    }

    const reservedBook = await this.bookRepository.decrementAvailableQuantity(book.id);

    if (!reservedBook) {
      const error = new Error('Livro indisponivel para emprestimo.');
      error.status = 400;
      throw error;
    }

    let loan;
    try {
      loan = await this.loanRepository.create({
        ...loanData,
        user: user.id,
        borrowerName: user.name
      });
    } catch (error) {
      await this.bookRepository.incrementAvailableQuantity(book.id);
      throw error;
    }

    return this.loanRepository.findById(loan.id);
  }

  async returnLoan(id, authenticatedUser) {
    const loan = await this.getLoanById(id, authenticatedUser);

    if (loan.status === 'returned') {
      const error = new Error('Emprestimo ja foi devolvido.');
      error.status = 400;
      throw error;
    }

    const bookId = loan.book && loan.book.id;
    if (bookId) {
      await this.bookRepository.incrementAvailableQuantity(bookId);
    }

    return this.loanRepository.update(id, {
      status: 'returned',
      returnDate: new Date()
    });
  }
}

module.exports = LoanService;
