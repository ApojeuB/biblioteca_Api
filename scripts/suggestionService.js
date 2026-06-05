const SuggestionRepository = require('../repositories/suggestionRepository');
const EmailService = require('./emailService');
const UserRepository = require('../repositories/userRepository');

class SuggestionService {
  constructor(
    suggestionRepository = new SuggestionRepository(),
    emailService = new EmailService(),
    userRepository = new UserRepository()
  ) {
    this.suggestionRepository = suggestionRepository;
    this.emailService = emailService;
    this.userRepository = userRepository;
  }

  async listSuggestions() {
    return this.suggestionRepository.findAll();
  }

  async createSuggestion(suggestionData, authenticatedUser) {
    const user = authenticatedUser
      ? await this.userRepository.findById(authenticatedUser.id)
      : null;

    const suggestion = await this.suggestionRepository.create({
      name: suggestionData.name || user?.name,
      email: suggestionData.email || user?.email,
      message: suggestionData.message
    });

    try {
      const emailResult = await this.emailService.sendSuggestion(suggestion);

      return this.suggestionRepository.update(suggestion.id, {
        emailStatus: emailResult.status,
        emailError: emailResult.error,
        sentAt: emailResult.status === 'sent' ? new Date() : null
      });
    } catch (error) {
      return this.suggestionRepository.update(suggestion.id, {
        emailStatus: 'failed',
        emailError: error.message
      });
    }
  }
}

module.exports = SuggestionService;
