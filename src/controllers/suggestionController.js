const SuggestionService = require('../services/suggestionService');

const suggestionService = new SuggestionService();

class SuggestionController {
  async index(req, res, next) {
    try {
      const suggestions = await suggestionService.listSuggestions();
      res.json(suggestions);
    } catch (error) {
      next(error);
    }
  }

  async store(req, res, next) {
    try {
      const suggestion = await suggestionService.createSuggestion(req.body, req.user);
      res.status(201).json(suggestion);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SuggestionController();
