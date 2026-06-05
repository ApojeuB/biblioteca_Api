const BookService = require('../services/bookService');

const bookService = new BookService();

class BookController {
  async index(req, res, next) {
    try {
      const books = await bookService.listBooks();
      res.json(books);
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const book = await bookService.getBookById(req.params.id);
      res.json(book);
    } catch (error) {
      next(error);
    }
  }

  async store(req, res, next) {
    try {
      const book = await bookService.createBook(req.body);
      res.status(201).json(book);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const book = await bookService.updateBook(req.params.id, req.body);
      res.json(book);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await bookService.deleteBook(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookController();
