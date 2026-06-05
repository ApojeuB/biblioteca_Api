const nodemailer = require('nodemailer');

class EmailService {
  constructor(env = process.env) {
    this.env = env;
  }

  isConfigured() {
    return Boolean(
      this.env.SMTP_HOST &&
        this.env.SMTP_PORT &&
        this.env.SMTP_USER &&
        this.env.SMTP_PASS &&
        this.getRecipient()
    );
  }

  getRecipient() {
    return this.env.SUGGESTION_TO_EMAIL || this.env.SMTP_USER;
  }

  createTransporter() {
    return nodemailer.createTransport({
      host: this.env.SMTP_HOST,
      port: Number(this.env.SMTP_PORT),
      secure: this.env.SMTP_SECURE === 'true',
      auth: {
        user: this.env.SMTP_USER,
        pass: this.env.SMTP_PASS
      }
    });
  }

  async sendSuggestion(suggestion) {
    if (!this.isConfigured()) {
      return {
        status: 'skipped',
        error: 'Envio de email nao configurado.'
      };
    }

    const transporter = this.createTransporter();
    const from = this.env.SUGGESTION_FROM_EMAIL || this.env.SMTP_USER;
    const recipient = this.getRecipient();
    const senderName = suggestion.name || 'Anonimo';
    const senderEmail = suggestion.email || 'Nao informado';

    await transporter.sendMail({
      from,
      to: recipient,
      replyTo: suggestion.email || undefined,
      subject: 'Nova sugestao recebida - Biblioteca API',
      text: [
        'Nova sugestao recebida:',
        '',
        `Nome: ${senderName}`,
        `Email: ${senderEmail}`,
        '',
        suggestion.message
      ].join('\n')
    });

    return {
      status: 'sent',
      error: null
    };
  }
}

module.exports = EmailService;
