const LoanService = require('../services/loanService');

const loanService = new LoanService();

class LoanController {
  async index(req, res, next) {
    try {
      const loans = await loanService.listLoans(req.user);
      res.json(loans);
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const loan = await loanService.getLoanById(req.params.id, req.user);
      res.json(loan);
    } catch (error) {
      next(error);
    }
  }

  async store(req, res, next) {
    try {
      const loan = await loanService.createLoan(req.body, req.user);
      res.status(201).json(loan);
    } catch (error) {
      next(error);
    }
  }

  async return(req, res, next) {
    try {
      const loan = await loanService.returnLoan(req.params.id, req.user);
      res.json(loan);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LoanController();
