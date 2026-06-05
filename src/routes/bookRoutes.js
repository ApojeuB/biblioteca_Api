const { Router } = require('express');
const bookController = require('../controllers/bookController');
const requireAuth = require('../middlewares/authMiddleware');

const router = Router();

router.get('/', bookController.index);
router.get('/:id', bookController.show);
router.post('/', requireAuth, bookController.store);
router.put('/:id', requireAuth, bookController.update);
router.delete('/:id', requireAuth, bookController.delete);

module.exports = router;
