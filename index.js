const express = require('express');
const cors = require('cors');
const fetch = require('cross-fetch');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Razorpay = require('razorpay')

const userRoutes = require('./routes/user.js');

const app = express();
const port = 3000;
dotenv.config();

app.use(cors());
app.use(express.json());

app.use('/user', userRoutes)


module.exports = {
    instance: new Razorpay({
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_APT_SECRET,
    })
}

app.get('/', (req, res) => {
    res.send('YumYum- server')
})

app.get('/api/restaurants', (req, res) => {
    fs.readFile(path.join(__dirname, './data/restaurants.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            res.status(500).send('An error occurred');
            return
        }
        res.json(JSON.parse(data));
    });
});

app.get('/api/menu', (req, res) => {
    const { id } = req.query
    fs.readFile(path.join(__dirname, `./data/menu/${id}.json`), 'utf8', (err, data) => {
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

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}
connectDB();

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});


