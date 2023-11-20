const express = require('express');
const { getOrders } = require('../controllers/order');

const router = express.Router();

router.get('/:userId', getOrders);