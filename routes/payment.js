const express = require('express');
const { payment, webhook } = require('../controllers/payment.js');

const router = express.Router();

router.post('/pay', payment);
router.post('/webhook', express.raw({ type: 'application/json' }), webhook)

module.exports = router;
