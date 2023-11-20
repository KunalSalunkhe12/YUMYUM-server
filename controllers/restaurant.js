const fs = require('fs');
const path = require('path');

const getRestaurants = (req, res) => {
    fs.readFile(path.join(__dirname, '../data/restaurants.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            res.status(500).send('An error occurred');
            return
        }
        res.json(JSON.parse(data));
    });
}

const getMenu = (req, res) => {
    const { id } = req.params;
    fs.readFile(path.join(__dirname, `../data/menu/${id}.json`), 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            res.status(500).send('An error occurred');
            return
        }
        res.json(JSON.parse(data));
    });
}

module.exports = { getRestaurants, getMenu };