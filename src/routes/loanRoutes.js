const { Router } = require('express');
const loanController = require('../controllers/loanController');
const requireAuth = require('../middlewares/authMiddleware');

const router = Router();

router.get('/', requireAuth, loanController.index);
router.get('/:id', requireAuth, loanController.show);
router.post('/', requireAuth, loanController.store);
router.patch('/:id/return', requireAuth, loanController.return);

module.exports = router;
