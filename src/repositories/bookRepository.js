const Book = require('../models/Book');

class BookRepository {
  async findAll() {
    return Book.find().sort({ title: 1 });
  }

  async findById(id) {
    return Book.findById(id);
  }

  async findByIsbn(isbn) {
    return Book.findOne({ isbn });
  }

  async create(bookData) {
    return Book.create(bookData);
  }

  async update(id, bookData) {
    return Book.findByIdAndUpdate(id, bookData, {
      new: true,
      runValidators: true
    });
  }

  async decrementAvailableQuantity(id) {
    return Book.findOneAndUpdate(
      { _id: id, availableQuantity: { $gt: 0 } },
      { $inc: { availableQuantity: -1 } },
      {
        new: true,
        runValidators: true
      }
    );
  }

  async incrementAvailableQuantity(id) {
    return Book.findOneAndUpdate(
      { _id: id, $expr: { $lt: ['$availableQuantity', '$quantity'] } },
      { $inc: { availableQuantity: 1 } },
      {
        new: true,
        runValidators: true
      }
    );
  }

  async delete(id) {
    return Book.findByIdAndDelete(id);
  }
}

module.exports = BookRepository;
