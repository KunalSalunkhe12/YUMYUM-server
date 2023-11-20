const express = require('express');
const cors = require('cors');
const fetch = require('cross-fetch');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser')
dotenv.config();

const restaurantRoutes = require('./routes/restaurant.js');
const userRoutes = require('./routes/user.js');
const paymentRoutes = require('./routes/payment.js');
const orderRoutes = require('./routes/order.js');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({
    verify: (req, res, buf) => {
        req.rawBody = buf
    }
}))

app.use('/api', restaurantRoutes)
app.use('/user', userRoutes)
app.use('/create-checkout-session', paymentRoutes)
app.use('/order', orderRoutes)

app.get('/', (req, res) => {
    res.send('YumYum- server')
})

//Old search api
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


