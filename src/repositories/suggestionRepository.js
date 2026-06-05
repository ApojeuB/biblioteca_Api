const Suggestion = require('../models/Suggestion');

class SuggestionRepository {
  async findAll() {
    return Suggestion.find().sort({ createdAt: -1 });
  }

  async create(suggestionData) {
    return Suggestion.create(suggestionData);
  }

  async update(id, suggestionData) {
    return Suggestion.findByIdAndUpdate(id, suggestionData, {
      new: true,
      runValidators: true
    });
  }
}

module.exports = SuggestionRepository;
