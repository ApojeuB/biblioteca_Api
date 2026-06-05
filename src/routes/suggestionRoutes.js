const { Router } = require('express');
const suggestionController = require('../controllers/suggestionController');
const requireAuth = require('../middlewares/authMiddleware');

const router = Router();

router.get('/', requireAuth, suggestionController.index);
router.post('/', requireAuth, suggestionController.store);

module.exports = router;
