const BookRepository = require('../repositories/bookRepository');
const LoanRepository = require('../repositories/loanRepository');
const mongoose = require('mongoose');

class BookService {
  constructor(
    bookRepository = new BookRepository(),
    loanRepository = new LoanRepository()
  ) {
    this.bookRepository = bookRepository;
    this.loanRepository = loanRepository;
  }

  async listBooks() {
    return this.bookRepository.findAll();
  }

  async getBookById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error('ID de livro invalido.');
      error.status = 400;
      throw error;
    }

    const book = await this.bookRepository.findById(id);

    if (!book) {
      const error = new Error('Livro nao encontrado.');
      error.status = 404;
      throw error;
    }

    return book;
  }

  async createBook(bookData) {
    const existingBook = bookData.isbn
      ? await this.bookRepository.findByIsbn(bookData.isbn)
      : null;

    if (existingBook) {
      const error = new Error('Ja existe um livro cadastrado com este ISBN.');
      error.status = 409;
      throw error;
    }

    const quantity = bookData.quantity ?? 1;
    const { availableQuantity, ...bookPayload } = bookData;

    return this.bookRepository.create({
      ...bookPayload,
      quantity,
      availableQuantity: quantity
    });
  }

  async updateBook(id, bookData) {
    const currentBook = await this.getBookById(id);
    const activeLoans = await this.loanRepository.countActiveByBook(id);

    if (bookData.quantity !== undefined && bookData.quantity < activeLoans) {
      const error = new Error('Quantidade total nao pode ser menor que emprestimos ativos.');
      error.status = 400;
      throw error;
    }

    const quantity = bookData.quantity ?? currentBook.quantity;
    const loanedQuantity = currentBook.quantity - currentBook.availableQuantity;
    const availableQuantity = Math.max(quantity - loanedQuantity, 0);

    return this.bookRepository.update(id, {
      ...bookData,
      quantity,
      availableQuantity
    });
  }

  async deleteBook(id) {
    await this.getBookById(id);

    const activeLoans = await this.loanRepository.countActiveByBook(id);
    if (activeLoans > 0) {
      const error = new Error('Nao e possivel remover livro com emprestimos ativos.');
      error.status = 400;
      throw error;
    }

    return this.bookRepository.delete(id);
  }
}

module.exports = BookService;
