const express = require('express');
const { getRestaurants, getMenu } = require('../controllers/restaurant.js');

const router = express.Router();

router.get('/restaurants', getRestaurants);
router.get('/menu/:id', getMenu);

module.exports = router;
