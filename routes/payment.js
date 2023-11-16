const express = require('express');
const { payment } = require('../controllers/payment.js');

const router = express.Router();

router.post('/', payment);

module.exports = router;
