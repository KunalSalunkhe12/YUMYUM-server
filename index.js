const express = require('express');
const cors = require('cors');
const fetch = require('cross-fetch');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes

app.get('/', (req, res) => {
    res.send('YumYum- server')
})

app.get('/restaurants', (req, res) => {
    fs.readFile('./data/restaurants.json', (err, data) => {
        if (err) {
            console.error(err)
            res.status(500).send('An error occurred');
            return
        }
        res.json(JSON.parse(data));
    });
});

app.get('/menu', (req, res) => {
    const { id } = req.query
    fs.readFile(`./data/menu/${id}.json`, (err, data) => {
        if (err) {
            console.error(err)
            res.status(500).send('An error occurred');
            return
        }
        res.json(JSON.parse(data));
    });
});

app.get('/search', (req, res) => {
    const { searchInput } = req.query
    const url = `https://www.swiggy.com/dapi/restaurants/search/v3?lat=19.3667296&lng=72.819814&str=${searchInput}&trackingId=undefined&submitAction=ENTER&queryUniqueId=d27bc450-4b77-77b6-ba67-9b72b1edbb08&selectedPLTab=RESTAURANT`

    fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'

        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('An error occurred');
        });
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
