const express = require('express');
const { getOrders } = require('../controllers/order');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/:userId', authMiddleware, getOrders);

module.exports = router;