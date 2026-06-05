const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    isbn: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },
    country: {
      type: String,
      trim: true
    },
    language: {
      type: String,
      trim: true
    },
    pages: {
      type: Number,
      min: 0
    },
    year: {
      type: Number
    },
    imageLink: {
      type: String,
      trim: true
    },
    link: {
      type: String,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 1
    },
    availableQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Book', bookSchema);
